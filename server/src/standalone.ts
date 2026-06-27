import Koa from 'koa';
import Router from '@koa/router';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';
import * as mysql from 'mysql2/promise';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

const JWT_SECRET = 'wudong-secret';

// ====== MySQL Connection Pool ======
const pool = mysql.createPool({
  host: '127.0.0.1',
  port: 3306,
  user: 'root',
  password: '123456',
  database: 'wudong_travel_dev',
  charset: 'utf8mb4',
  waitForConnections: true,
  connectionLimit: 10,
});

// Ensure every connection uses UTF-8
pool.on('connection', (conn) => {
  conn.query("SET NAMES 'utf8mb4'", () => {});
  conn.query("SET CHARACTER SET utf8mb4", () => {});
});

// Helper: parse JSON fields from MySQL (they come as strings)
function parseMaterials(val: any): string[] {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  try { return JSON.parse(val); } catch { return []; }
}

const app = new Koa();
const router = new Router({ prefix: '/api' });

app.use(cors());
app.use(bodyParser({ encoding: 'utf-8' }));

// ====== JWT Helper ======
function signToken(payload: any) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

// ====== Captcha ======
const captchaStore = new Map<string, { code: string; expires: number }>();

function generateCaptchaCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 4; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

function generateCaptchaSVG(code: string): string {
  const colors = ['#1B3A5C', '#C8A45C', '#8B6914', '#D4380D', '#389E0D', '#096DD9'];
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="140" height="50" viewBox="0 0 140 50"><rect width="140" height="50" fill="#F5F5F5" rx="6"/>`;
  for (let i = 0; i < 3; i++) svg += `<line x1="5" y1="${10 + i * 16}" x2="135" y2="${14 + i * 14}" stroke="#E0E0E0" stroke-width="1"/>`;
  for (let i = 0; i < 8; i++) svg += `<circle cx="${Math.floor(Math.random() * 140)}" cy="${Math.floor(Math.random() * 50)}" r="1.5" fill="#CCC"/>`;
  for (let i = 0; i < code.length; i++) {
    svg += `<text x="${18 + i * 30}" y="36" transform="rotate(${(Math.random() - 0.5) * 20},${18 + i * 30},36)" font-size="28" font-weight="bold" fill="${colors[i % colors.length]}" font-family="Arial">${code[i]}</text>`;
  }
  return svg + '</svg>';
}

// ====== Auth Middleware ======
function authRequired(ctx: any, next: any) {
  const authHeader = ctx.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    ctx.status = 401;
    ctx.body = { code: 401, message: '未登录', data: null };
    return;
  }
  try {
    ctx.currentUser = jwt.verify(authHeader.slice(7), JWT_SECRET);
  } catch {
    ctx.status = 401;
    ctx.body = { code: 401, message: '令牌无效', data: null };
    return;
  }
  return next();
}

// ====== AUTH ======
router.get('/admin/auth/captcha', async (ctx) => {
  const code = generateCaptchaCode();
  const captchaId = Math.random().toString(36).substring(2, 15);
  captchaStore.set(captchaId, { code, expires: Date.now() + 5 * 60 * 1000 });
  ctx.body = { code: 200, message: 'ok', data: { captchaId, svg: generateCaptchaSVG(code) } };
});

router.post('/admin/auth/login', async (ctx) => {
  const { username, password, captchaId, captchaCode } = ctx.request.body as any;

  // verify captcha
  const stored = captchaStore.get(captchaId || '');
  if (!stored || Date.now() > stored.expires) {
    ctx.body = { code: 401, message: '验证码已过期，请刷新', data: null };
    return;
  }
  if (stored.code !== (captchaCode || '').toUpperCase()) {
    ctx.body = { code: 401, message: '验证码错误', data: null };
    return;
  }
  captchaStore.delete(captchaId);

  // verify credentials from DB
  const [rows]: any = await pool.query('SELECT * FROM admin_user WHERE username = ?', [username]);
  if (!rows.length) {
    ctx.body = { code: 401, message: '用户名或密码错误', data: null };
    return;
  }
  const user = rows[0];
  if (user.status === 'disabled') {
    ctx.body = { code: 403, message: '账号已被禁用', data: null };
    return;
  }
  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    ctx.body = { code: 401, message: '用户名或密码错误', data: null };
    return;
  }

  // update last login
  await pool.query('UPDATE admin_user SET last_login_at = NOW() WHERE id = ?', [user.id]);

  const payload = { userId: user.id, username: user.username, role: 'admin', roleId: user.role_id || 1 };
  const token = signToken(payload);

  ctx.body = {
    code: 200, message: '登录成功',
    data: {
      token, refreshToken: token, expiresIn: 604800,
      userInfo: { id: user.id, username: user.username, name: user.name, roleId: user.role_id || 1, roleName: '超级管理员' },
    },
  };
});

router.post('/admin/auth/logout', async (ctx) => {
  ctx.body = { code: 200, message: '已退出', data: null };
});

router.post('/admin/auth/refresh', async (ctx) => {
  const { refreshToken } = ctx.request.body as any;
  if (!refreshToken) { ctx.body = { code: 401, message: '缺少令牌', data: null }; return; }
  try {
    const payload = jwt.verify(refreshToken, JWT_SECRET) as any;
    const token = signToken({ userId: payload.userId, username: payload.username, role: payload.role, roleId: payload.roleId });
    ctx.body = { code: 200, message: 'ok', data: { token, refreshToken: token, expiresIn: 604800 } };
  } catch {
    ctx.body = { code: 401, message: '令牌无效', data: null };
  }
});

// ====== DASHBOARD ======
router.get('/admin/dashboard/overview', async (ctx) => {
  try {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    // 基础统计：查询今日/总计数据
    const [[{ total_users }]]: any = await pool.query('SELECT COUNT(*) as total_users FROM admin_user');
    const [[{ total_merchants }]]: any = await pool.query('SELECT COUNT(*) as total_merchants FROM merchant');
    const [[{ active_merchants }]]: any = await pool.query("SELECT COUNT(*) as active_merchants FROM merchant WHERE status = 'active'");

    // DAU: 今日有订单的不同用户数
    const [[{ dau }]]: any = await pool.query(
      'SELECT COUNT(DISTINCT user_id) as dau FROM orders WHERE DATE(created_at) = ?',
      [today]
    );

    // 今日新增用户
    const [[{ newUsers }]]: any = await pool.query(
      'SELECT COUNT(*) as newUsers FROM admin_user WHERE DATE(created_at) = ?',
      [today]
    );

    // 今日订单数和GMV
    const [[todayOrder]]: any = await pool.query(
      "SELECT COUNT(*) as orderCount, COALESCE(SUM(amount), 0) as gmv FROM orders WHERE DATE(created_at) = ? AND status != 'cancelled'",
      [today]
    );

    // 近7日订单趋势（按日期和模块分组）
    const [orderRows]: any = await pool.query(
      `SELECT DATE(created_at) as date, module, COALESCE(SUM(amount), 0) as total
       FROM orders
       WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
         AND status IN ('paid','confirmed','shipped','received')
       GROUP BY DATE(created_at), module
       ORDER BY date`
    );

    // 构建 orderTrend: 最近7天，每个模块一个系列
    const modules = ['clothing', 'food', 'lodging', 'travel'];
    const dates: string[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      dates.push(d.toISOString().split('T')[0]);
    }
    const orderTrend = dates.map(date => {
      const item: any = { date: date.substring(5) }; // MM-DD
      for (const mod of modules) item[mod] = 0;
      orderRows.filter((r: any) => {
        const rd = r.date instanceof Date ? r.date.toISOString().split('T')[0] : String(r.date).substring(0, 10);
        return rd === date;
      }).forEach((r: any) => {
        if (item.hasOwnProperty(r.module)) item[r.module] = Number(r.total) || 0;
      });
      return item;
    });

    // 近7日用户增长（按创建日期分组）
    const [userGrowthRows]: any = await pool.query(
      `SELECT DATE(created_at) as date, COUNT(*) as count
       FROM admin_user
       WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
       GROUP BY DATE(created_at)
       ORDER BY date`
    );
    const userGrowth = dates.map(date => {
      const found = userGrowthRows.find((r: any) => {
        const rd = r.date instanceof Date ? r.date.toISOString().split('T')[0] : String(r.date).substring(0, 10);
        return rd === date;
      });
      return { date: date.substring(5), count: found ? Number(found.count) : 0 };
    });

    // 内容统计（公告数、轮播图数、消息数作为内容指标）
    const [[{ announcementCount }]]: any = await pool.query("SELECT COUNT(*) as announcementCount FROM announcement WHERE status = 'published'");
    const [[{ bannerCount }]]: any = await pool.query("SELECT COUNT(*) as bannerCount FROM banner WHERE status = 'published'");
    const [[{ messageCount }]]: any = await pool.query('SELECT COUNT(*) as messageCount FROM system_message');
    const contentStats = [
      { type: '公告', count: Number(announcementCount) },
      { type: '轮播图', count: Number(bannerCount) },
      { type: '消息', count: Number(messageCount) },
    ];

    // 商家统计：top商家按订单金额排序
    const [topMerchants]: any = await pool.query(
      `SELECT m.id, m.shop_name as shopName, m.module, m.status,
              COALESCE(SUM(o.amount), 0) as totalAmount,
              COUNT(o.id) as orderCount
       FROM merchant m
       LEFT JOIN orders o ON o.merchant_id = m.id AND o.status != 'cancelled'
       GROUP BY m.id
       ORDER BY totalAmount DESC
       LIMIT 5`
    );

    // 财务统计
    const [[finStats]]: any = await pool.query(
      `SELECT
         COALESCE(SUM(CASE WHEN status != 'cancelled' THEN amount ELSE 0 END), 0) as totalRevenue,
         COALESCE(SUM(CASE WHEN status != 'cancelled' THEN commission ELSE 0 END), 0) as platformIncome,
         COALESCE((SELECT SUM(total_income) FROM settlement_sheet WHERE status = 'pending'), 0) as pendingSettlement
       FROM orders`
    );

    ctx.body = {
      code: 200, message: '查询成功',
      data: {
        dau: Number(dau),
        newUsers: Number(newUsers),
        orderCount: Number(todayOrder.orderCount),
        gmv: Number(todayOrder.gmv),
        totalUsers: Number(total_users),
        totalMerchants: Number(total_merchants),
        activeMerchants: Number(active_merchants),
        orderTrend,
        userGrowth,
        contentStats,
        merchantStats: {
          total: Number(total_merchants),
          active: Number(active_merchants),
          top: topMerchants.map((m: any) => ({
            id: m.id,
            shopName: m.shopName,
            module: m.module,
            totalAmount: Number(m.totalAmount),
            orderCount: Number(m.orderCount),
          })),
        },
        financeStats: {
          totalRevenue: Number(finStats.totalRevenue),
          platformIncome: Number(finStats.platformIncome),
          pendingSettlement: Number(finStats.pendingSettlement),
        },
      },
    };
  } catch (err: any) {
    console.error('Dashboard error:', err.message);
    ctx.body = { code: 500, message: '查询失败: ' + err.message, data: null };
  }
});

// ====== USER MANAGEMENT ======
router.get('/admin/users/tourists', async (ctx) => {
  const page = Number(ctx.query.page) || 1;
  const pageSize = Number(ctx.query.pageSize) || 20;
  const keyword = ctx.query.keyword || '';
  const status = ctx.query.status;
  const offset = (page - 1) * pageSize;

  let sql = 'SELECT * FROM admin_user WHERE 1=1';
  const params: any[] = [];
  if (keyword) { sql += ' AND (username LIKE ? OR name LIKE ? OR phone LIKE ?)'; params.push(`%${keyword}%`, `%${keyword}%`, `%${keyword}%`); }
  if (status) { sql += ' AND status = ?'; params.push(status); }

  const [countRows]: any = await pool.query(`SELECT COUNT(*) as total FROM (${sql}) t`, params);
  sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
  params.push(pageSize, offset);
  const [rows]: any = await pool.query(sql, params);

  ctx.body = {
    code: 200, message: '查询成功',
    data: {
      list: rows.map((u: any) => ({
        id: u.id, username: u.username, name: u.name,
        phone: u.phone || '',
        roleId: u.role_id || 0, roleName: '', status: u.status,
        lastLoginAt: u.last_login_at, createdAt: u.created_at,
      })),
      total: countRows[0]?.total || 0, page, pageSize,
    },
  };
});

router.get('/admin/users/tourists/:id', async (ctx) => {
  const [rows]: any = await pool.query('SELECT * FROM admin_user WHERE id = ?', [ctx.params.id]);
  if (!rows.length) { ctx.body = { code: 404, message: '用户不存在', data: null }; return; }
  const u = rows[0];

  // 查询该用户的订单统计
  const [[orderStats]]: any = await pool.query(
    "SELECT COUNT(*) as totalOrders, COALESCE(SUM(amount), 0) as totalAmount FROM orders WHERE user_id = ? AND status != 'cancelled'",
    [u.id]
  );

  ctx.body = {
    code: 200, message: '查询成功',
    data: {
      id: u.id, username: u.username, name: u.name,
      phone: u.phone || '',
      avatar: '',
      roleId: u.role_id || 0, roleName: u.role_id === 1 ? '超级管理员' : u.role_id === 2 ? '运营管理员' : '财务管理员',
      status: u.status,
      lastLoginAt: u.last_login_at,
      createdAt: u.created_at,
      orderStats: {
        totalOrders: Number(orderStats.totalOrders),
        totalAmount: Number(orderStats.totalAmount),
      },
    },
  };
});

router.put('/admin/users/tourists/:id/ban', async (ctx) => {
  await pool.query("UPDATE admin_user SET status = 'disabled' WHERE id = ?", [ctx.params.id]);
  // 记录操作日志
  await pool.query('INSERT INTO admin_operation_log (operator_id, operator_name, action_type, target_type, target_id, action_detail, ip) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [1, '超级管理员', 'ban_user', 'admin_user', ctx.params.id, '禁用用户', ctx.ip]);
  ctx.body = { code: 200, message: '已禁用该用户', data: null };
});

router.put('/admin/users/tourists/:id/unban', async (ctx) => {
  await pool.query("UPDATE admin_user SET status = 'active' WHERE id = ?", [ctx.params.id]);
  await pool.query('INSERT INTO admin_operation_log (operator_id, operator_name, action_type, target_type, target_id, action_detail, ip) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [1, '超级管理员', 'unban_user', 'admin_user', ctx.params.id, '解禁用户', ctx.ip]);
  ctx.body = { code: 200, message: '已解禁该用户', data: null };
});

// ====== MERCHANT MANAGEMENT ======
router.get('/admin/users/merchants', async (ctx) => {
  const page = Number(ctx.query.page) || 1;
  const pageSize = Number(ctx.query.pageSize) || 20;
  const offset = (page - 1) * pageSize;

  const [countRows]: any = await pool.query('SELECT COUNT(*) as total FROM merchant');
  const [rows]: any = await pool.query('SELECT * FROM merchant ORDER BY created_at DESC LIMIT ? OFFSET ?', [pageSize, offset]);

  ctx.body = {
    code: 200, message: '查询成功',
    data: {
      list: rows.map((m: any) => ({
        id: m.id, username: m.username, shopName: m.shop_name, module: m.module,
        contactName: m.contact_name, contactPhone: m.contact_phone,
        contactEmail: m.contact_email || '', status: m.status,
        settledAt: m.settled_at, createdAt: m.created_at,
      })),
      total: countRows[0]?.total || 0, page, pageSize,
    },
  };
});

router.get('/admin/users/merchants/:id', async (ctx) => {
  const [rows]: any = await pool.query('SELECT * FROM merchant WHERE id = ?', [ctx.params.id]);
  if (!rows.length) { ctx.body = { code: 404, message: '不存在', data: null }; return; }
  const m = rows[0];
  ctx.body = {
    code: 200, message: '查询成功',
    data: {
      id: m.id, username: m.username, shopName: m.shop_name, module: m.module,
      contactName: m.contact_name, contactPhone: m.contact_phone,
      contactEmail: m.contact_email || '', status: m.status,
      settledAt: m.settled_at, createdAt: m.created_at,
    },
  };
});

router.put('/admin/users/merchants/:id/status', async (ctx) => {
  const { status } = ctx.query;
  await pool.query('UPDATE merchant SET status = ? WHERE id = ?', [status, ctx.params.id]);
  ctx.body = { code: 200, message: '状态更新成功', data: null };
});

// ====== ROLES & PERMISSIONS ======
router.get('/admin/roles', async (ctx) => {
  const [roles]: any = await pool.query('SELECT * FROM admin_role ORDER BY id');
  ctx.body = { code: 200, message: '查询成功', data: roles.map((r: any) => ({ id: r.id, name: r.name, description: r.description || '', permissions: [], createdAt: r.created_at })) };
});

router.get('/admin/roles/permissions', async (ctx) => {
  const [perms]: any = await pool.query('SELECT * FROM admin_permission ORDER BY id');
  ctx.body = { code: 200, message: '查询成功', data: perms.map((p: any) => ({ id: p.id, code: p.code, name: p.name, group: p.perm_group || '' })) };
});

router.post('/admin/roles', async (ctx) => {
  const { name, description, permissionIds } = ctx.request.body as any;
  const [result]: any = await pool.query('INSERT INTO admin_role (name, description) VALUES (?, ?)', [name, description]);
  if (permissionIds?.length) {
    const values = permissionIds.map((pid: number) => [result.insertId, pid]);
    await pool.query('INSERT INTO admin_role_permission (role_id, permission_id) VALUES ?', [values]);
  }
  ctx.body = { code: 200, message: '创建成功', data: { id: result.insertId } };
});

router.put('/admin/roles/:id', async (ctx) => {
  const { name, description, permissionIds } = ctx.request.body as any;
  if (Number(ctx.params.id) === 1) { ctx.body = { code: 403, message: '不可修改超级管理员', data: null }; return; }
  await pool.query('UPDATE admin_role SET name = ?, description = ? WHERE id = ?', [name, description, ctx.params.id]);
  if (permissionIds) {
    await pool.query('DELETE FROM admin_role_permission WHERE role_id = ?', [ctx.params.id]);
    if (permissionIds.length) {
      const values = permissionIds.map((pid: number) => [ctx.params.id, pid]);
      await pool.query('INSERT INTO admin_role_permission (role_id, permission_id) VALUES ?', [values]);
    }
  }
  ctx.body = { code: 200, message: '更新成功', data: null };
});

router.delete('/admin/roles/:id', async (ctx) => {
  if (Number(ctx.params.id) === 1) { ctx.body = { code: 403, message: '不可删除超级管理员', data: null }; return; }
  await pool.query('DELETE FROM admin_role_permission WHERE role_id = ?', [ctx.params.id]);
  await pool.query('DELETE FROM admin_role WHERE id = ?', [ctx.params.id]);
  ctx.body = { code: 200, message: '删除成功', data: null };
});

// ====== AUDIT ======
router.get('/admin/audit/applications', async (ctx) => {
  const page = Number(ctx.query.page) || 1;
  const pageSize = Number(ctx.query.pageSize) || 20;
  const status = ctx.query.status;
  const offset = (page - 1) * pageSize;

  let sql = 'SELECT * FROM merchant_application';
  const params: any[] = [];
  if (status) { sql += ' WHERE status = ?'; params.push(status); }

  const [countRows]: any = await pool.query(`SELECT COUNT(*) as total FROM (${sql}) t`, params);
  sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
  params.push(pageSize, offset);
  const [rows]: any = await pool.query(sql, params);

  ctx.body = {
    code: 200, message: '查询成功',
    data: {
      list: rows.map((a: any) => ({ id: a.id, userId: a.user_id, shopName: a.shop_name, module: a.module, contactName: a.contact_name, contactPhone: a.contact_phone, contactEmail: a.contact_email || '', shopDescription: a.shop_description || '', materials: parseMaterials(a.materials), status: a.status, reviewerId: a.reviewer_id, reviewComment: a.review_comment || '', reviewedAt: a.reviewed_at, createdAt: a.created_at })),
      total: countRows[0]?.total || 0, page, pageSize,
    },
  };
});

router.get('/admin/audit/applications/:id', async (ctx) => {
  const [rows]: any = await pool.query('SELECT * FROM merchant_application WHERE id = ?', [ctx.params.id]);
  if (!rows.length) { ctx.body = { code: 404, message: '不存在', data: null }; return; }
  const a = rows[0];
  ctx.body = { code: 200, message: '查询成功', data: { id: a.id, userId: a.user_id, shopName: a.shop_name, module: a.module, contactName: a.contact_name, contactPhone: a.contact_phone, contactEmail: a.contact_email || '', shopDescription: a.shop_description || '', materials: parseMaterials(a.materials), status: a.status, reviewerId: a.reviewer_id, reviewComment: a.review_comment || '', reviewedAt: a.reviewed_at, createdAt: a.created_at } };
});

router.post('/admin/audit/applications/:id/audit', async (ctx) => {
  const { action, module, reason } = ctx.request.body as any;
  const [apps]: any = await pool.query('SELECT * FROM merchant_application WHERE id = ?', [ctx.params.id]);
  if (!apps.length) { ctx.body = { code: 404, message: '不存在', data: null }; return; }
  const app = apps[0];
  if (app.status !== 'pending') { ctx.body = { code: 400, message: '已处理', data: null }; return; }

  if (action === 'approve') {
    await pool.query('UPDATE merchant_application SET status = ?, reviewer_id = 1, reviewed_at = NOW() WHERE id = ?', ['approved', ctx.params.id]);
    const targetModule = module || app.module;
    const pwdHash = await bcrypt.hash('123456', 12);
    await pool.query('INSERT INTO merchant (username, password_hash, shop_name, module, contact_name, contact_phone, contact_email, shop_description, status, settled_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())',
      [`merchant_${app.shop_name}`.substring(0, 50), pwdHash, app.shop_name, targetModule, app.contact_name, app.contact_phone, app.contact_email, app.shop_description, 'active']);
    ctx.body = { code: 200, message: '审核通过，商家账号已创建', data: null };
  } else {
    await pool.query('UPDATE merchant_application SET status = ?, reviewer_id = 1, review_comment = ?, reviewed_at = NOW() WHERE id = ?', ['rejected', reason || '', ctx.params.id]);
    ctx.body = { code: 200, message: '已驳回', data: null };
  }
});

// ====== HOMEPAGE OPS ======
router.get('/admin/homepage/banners', async (ctx) => {
  const [rows]: any = await pool.query('SELECT * FROM banner ORDER BY sort_order');
  ctx.body = { code: 200, message: '查询成功', data: { list: rows.map((b: any) => ({ id: b.id, title: b.title, imageUrl: b.image_url, linkUrl: b.link_url || '', sortOrder: b.sort_order, status: b.status, createdAt: b.created_at })), total: rows.length, page: 1, pageSize: 100 } };
});

router.post('/admin/homepage/banners', async (ctx) => {
  const { title, imageUrl, linkUrl, sortOrder, status } = ctx.request.body as any;
  await pool.query('INSERT INTO banner (title, image_url, link_url, sort_order, status) VALUES (?, ?, ?, ?, ?)', [title, imageUrl, linkUrl || '', sortOrder || 0, status || 'published']);
  ctx.body = { code: 200, message: '创建成功', data: null };
});

router.put('/admin/homepage/banners/:id', async (ctx) => {
  const { title, imageUrl, linkUrl, sortOrder, status } = ctx.request.body as any;
  await pool.query('UPDATE banner SET title=?, image_url=?, link_url=?, sort_order=?, status=? WHERE id=?', [title, imageUrl, linkUrl || '', sortOrder || 0, status || 'published', ctx.params.id]);
  ctx.body = { code: 200, message: '更新成功', data: null };
});

router.delete('/admin/homepage/banners/:id', async (ctx) => {
  await pool.query('DELETE FROM banner WHERE id = ?', [ctx.params.id]);
  ctx.body = { code: 200, message: '删除成功', data: null };
});

router.get('/admin/homepage/announcements', async (ctx) => {
  const [rows]: any = await pool.query('SELECT * FROM announcement ORDER BY created_at DESC');
  ctx.body = { code: 200, message: '查询成功', data: { list: rows.map((a: any) => ({ id: a.id, title: a.title, content: a.content, publishedAt: a.published_at, status: a.status, createdAt: a.created_at })), total: rows.length, page: 1, pageSize: 100 } };
});

router.post('/admin/homepage/announcements', async (ctx) => {
  const { title, content, status } = ctx.request.body as any;
  const publishedAt = status === 'published' ? new Date() : null;
  await pool.query('INSERT INTO announcement (title, content, published_at, status) VALUES (?, ?, ?, ?)', [title, content, publishedAt, status || 'draft']);
  ctx.body = { code: 200, message: '创建成功', data: null };
});

router.put('/admin/homepage/announcements/:id', async (ctx) => {
  const { title, content, status } = ctx.request.body as any;
  await pool.query('UPDATE announcement SET title=?, content=?, status=? WHERE id=?', [title, content, status, ctx.params.id]);
  ctx.body = { code: 200, message: '更新成功', data: null };
});

router.delete('/admin/homepage/announcements/:id', async (ctx) => {
  await pool.query('DELETE FROM announcement WHERE id = ?', [ctx.params.id]);
  ctx.body = { code: 200, message: '删除成功', data: null };
});

// Activity banners
router.get('/admin/homepage/activities', async (ctx) => {
  const [rows]: any = await pool.query('SELECT * FROM activity_banner ORDER BY created_at DESC');
  ctx.body = { code: 200, message: '查询成功', data: { list: rows.map((a: any) => ({ id: a.id, title: a.title, imageUrl: a.image_url, linkUrl: a.link_url || '', startTime: a.start_time, endTime: a.end_time, status: a.status, createdAt: a.created_at })), total: rows.length, page: 1, pageSize: 100 } };
});

router.post('/admin/homepage/activities', async (ctx) => {
  const { title, imageUrl, linkUrl, startTime, endTime, status } = ctx.request.body as any;
  await pool.query('INSERT INTO activity_banner (title, image_url, link_url, start_time, end_time, status) VALUES (?, ?, ?, ?, ?, ?)', [title, imageUrl, linkUrl || '', startTime, endTime, status || 'draft']);
  ctx.body = { code: 200, message: '创建成功', data: null };
});

router.put('/admin/homepage/activities/:id', async (ctx) => {
  const { title, imageUrl, linkUrl, startTime, endTime, status } = ctx.request.body as any;
  await pool.query('UPDATE activity_banner SET title=?, image_url=?, link_url=?, start_time=?, end_time=?, status=? WHERE id=?', [title, imageUrl, linkUrl || '', startTime, endTime, status, ctx.params.id]);
  ctx.body = { code: 200, message: '更新成功', data: null };
});

router.delete('/admin/homepage/activities/:id', async (ctx) => {
  await pool.query('DELETE FROM activity_banner WHERE id = ?', [ctx.params.id]);
  ctx.body = { code: 200, message: '删除成功', data: null };
});

// Recommendation slots
router.get('/admin/homepage/recommendations', async (ctx) => {
  const [rows]: any = await pool.query('SELECT * FROM recommendation_slot ORDER BY sort_order');
  ctx.body = { code: 200, message: '查询成功', data: { list: rows.map((r: any) => ({ id: r.id, slotName: r.slot_name, contentType: r.content_type, contentId: r.content_id, sortOrder: r.sort_order, status: r.status, createdAt: r.created_at })), total: rows.length, page: 1, pageSize: 100 } };
});

router.post('/admin/homepage/recommendations', async (ctx) => {
  const { slotName, contentType, contentId, sortOrder, status } = ctx.request.body as any;
  await pool.query('INSERT INTO recommendation_slot (slot_name, content_type, content_id, sort_order, status) VALUES (?, ?, ?, ?, ?)', [slotName, contentType, contentId, sortOrder || 0, status || 'published']);
  ctx.body = { code: 200, message: '创建成功', data: null };
});

router.put('/admin/homepage/recommendations/:id', async (ctx) => {
  const { slotName, contentType, contentId, sortOrder, status } = ctx.request.body as any;
  await pool.query('UPDATE recommendation_slot SET slot_name=?, content_type=?, content_id=?, sort_order=?, status=? WHERE id=?', [slotName, contentType, contentId, sortOrder || 0, status || 'published', ctx.params.id]);
  ctx.body = { code: 200, message: '更新成功', data: null };
});

router.delete('/admin/homepage/recommendations/:id', async (ctx) => {
  await pool.query('DELETE FROM recommendation_slot WHERE id = ?', [ctx.params.id]);
  ctx.body = { code: 200, message: '删除成功', data: null };
});

// ====== MESSAGES ======
router.post('/admin/messages/send', async (ctx) => {
  const { type, title, content, userIds, sendAll } = ctx.request.body as any;
  if (sendAll) {
    await pool.query('INSERT INTO system_message (user_id, type, title, content, is_read) VALUES (NULL, ?, ?, ?, false)', [type, title, content]);
  } else if (userIds?.length) {
    for (const uid of userIds) {
      await pool.query('INSERT INTO system_message (user_id, type, title, content, is_read) VALUES (?, ?, ?, ?, false)', [uid, type, title, content]);
    }
  }
  ctx.body = { code: 200, message: '发送成功', data: null };
});

router.get('/admin/messages/history', async (ctx) => {
  const page = Number(ctx.query.page) || 1;
  const pageSize = Number(ctx.query.pageSize) || 20;
  const type = ctx.query.type;
  const offset = (page - 1) * pageSize;

  let sql = 'SELECT * FROM system_message WHERE 1=1';
  const params: any[] = [];
  if (type) { sql += ' AND type = ?'; params.push(type); }

  const [countRows]: any = await pool.query(`SELECT COUNT(*) as total FROM (${sql}) t`, params);
  sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
  params.push(pageSize, offset);
  const [rows]: any = await pool.query(sql, params);

  ctx.body = { code: 200, message: '查询成功', data: { list: rows.map((m: any) => ({ id: m.id, userId: m.user_id, type: m.type, title: m.title, content: m.content, isRead: m.is_read, createdAt: m.created_at })), total: countRows[0]?.total || 0, page, pageSize } };
});

router.get('/admin/messages/templates', async (ctx) => {
  const [rows]: any = await pool.query('SELECT * FROM message_template ORDER BY created_at DESC');
  ctx.body = { code: 200, message: '查询成功', data: rows.map((t: any) => ({ id: t.id, code: t.code, name: t.name, titleTemplate: t.title_template, contentTemplate: t.content_template, type: t.type, updatedAt: t.updated_at })) };
});

router.post('/admin/messages/templates', async (ctx) => {
  const { code, name, titleTemplate, contentTemplate, type } = ctx.request.body as any;
  await pool.query('INSERT INTO message_template (code, name, title_template, content_template, type) VALUES (?, ?, ?, ?, ?)', [code, name, titleTemplate, contentTemplate, type]);
  ctx.body = { code: 200, message: '创建成功', data: null };
});

router.put('/admin/messages/templates/:id', async (ctx) => {
  const { name, titleTemplate, contentTemplate, type } = ctx.request.body as any;
  await pool.query('UPDATE message_template SET name=?, title_template=?, content_template=?, type=? WHERE id=?', [name, titleTemplate, contentTemplate, type, ctx.params.id]);
  ctx.body = { code: 200, message: '更新成功', data: null };
});

// ====== FINANCE ======
router.get('/admin/finance/settlements', async (ctx) => {
  const [rows]: any = await pool.query('SELECT * FROM settlement_sheet ORDER BY created_at DESC LIMIT 20');
  ctx.body = { code: 200, message: '查询成功', data: { list: rows.map((s: any) => ({ id: s.id, merchantId: s.merchant_id, merchantName: s.merchant_name, period: s.period, totalOrders: s.total_orders, totalAmount: s.total_amount, totalCommission: s.total_commission, totalIncome: s.total_income, status: s.status, createdAt: s.created_at })), total: rows.length, page: 1, pageSize: 20 } };
});

router.post('/admin/finance/settlements/generate', async (ctx) => {
  const [merchants]: any = await pool.query('SELECT id, shop_name FROM merchant WHERE status = ?', ['active']);
  for (const m of merchants) {
    await pool.query('INSERT INTO settlement_sheet (merchant_id, merchant_name, period, total_orders, total_amount, total_commission, total_income, status) VALUES (?, ?, ?, 0, 0, 0, 0, ?)', [m.id, m.shop_name, '2026-06', 'pending']);
  }
  ctx.body = { code: 200, message: `已为${merchants.length}个商家生成结算单`, data: null };
});

router.get('/admin/finance/settlements/:id', async (ctx) => {
  const [rows]: any = await pool.query('SELECT * FROM settlement_sheet WHERE id = ?', [ctx.params.id]);
  if (!rows.length) { ctx.body = { code: 404, message: '结算单不存在', data: null }; return; }
  const s = rows[0];

  // 查询关联结算记录
  const [records]: any = await pool.query(
    'SELECT * FROM settlement_record WHERE merchant_id = ? ORDER BY created_at DESC',
    [s.merchant_id]
  );

  ctx.body = {
    code: 200, message: '查询成功',
    data: {
      id: s.id, merchantId: s.merchant_id, merchantName: s.merchant_name,
      period: s.period, totalOrders: s.total_orders,
      totalAmount: Number(s.total_amount), totalCommission: Number(s.total_commission),
      totalIncome: Number(s.total_income), status: s.status, createdAt: s.created_at,
      records: records.map((r: any) => ({
        id: r.id, orderId: r.order_id,
        orderAmount: Number(r.order_amount), commissionRate: Number(r.commission_rate),
        commissionAmount: Number(r.commission_amount), merchantIncome: Number(r.merchant_income),
        status: r.status, settledAt: r.settled_at,
      })),
    },
  };
});

router.post('/admin/finance/settlements/:id/confirm', async (ctx) => {
  await pool.query('UPDATE settlement_sheet SET status = ? WHERE id = ?', ['confirmed', ctx.params.id]);
  ctx.body = { code: 200, message: '结算已确认', data: null };
});

// ====== GLOBAL ORDERS ======
router.get('/admin/orders', async (ctx) => {
  const page = Number(ctx.query.page) || 1;
  const pageSize = Number(ctx.query.pageSize) || 20;
  const module = ctx.query.module;
  const status = ctx.query.status;
  const keyword = ctx.query.keyword;
  const offset = (page - 1) * pageSize;

  let sql = 'SELECT * FROM orders WHERE 1=1';
  const params: any[] = [];
  if (module) { sql += ' AND module = ?'; params.push(module); }
  if (status) { sql += ' AND status = ?'; params.push(status); }
  if (keyword) { sql += ' AND (order_no LIKE ? OR merchant_name LIKE ? OR user_name LIKE ?)'; params.push(`%${keyword}%`, `%${keyword}%`, `%${keyword}%`); }

  const [countRows]: any = await pool.query(`SELECT COUNT(*) as total FROM (${sql}) t`, params);
  sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
  params.push(pageSize, offset);
  const [rows]: any = await pool.query(sql, params);

  ctx.body = {
    code: 200, message: '查询成功',
    data: {
      list: rows.map((o: any) => ({
        id: o.id, orderNo: o.order_no, module: o.module,
        merchantId: o.merchant_id, merchantName: o.merchant_name,
        userId: o.user_id, userName: o.user_name,
        amount: Number(o.amount), commission: Number(o.commission),
        status: o.status, createdAt: o.created_at, updatedAt: o.updated_at,
      })),
      total: countRows[0]?.total || 0, page, pageSize,
    },
  };
});

router.get('/admin/orders/:id', async (ctx) => {
  const [rows]: any = await pool.query('SELECT * FROM orders WHERE id = ?', [ctx.params.id]);
  if (!rows.length) { ctx.body = { code: 404, message: '订单不存在', data: null }; return; }
  const o = rows[0];
  ctx.body = {
    code: 200, message: '查询成功',
    data: {
      id: o.id, orderNo: o.order_no, module: o.module,
      merchantId: o.merchant_id, merchantName: o.merchant_name,
      userId: o.user_id, userName: o.user_name,
      amount: Number(o.amount), commission: Number(o.commission),
      status: o.status, createdAt: o.created_at, updatedAt: o.updated_at,
    },
  };
});

// ====== SYSTEM SETTINGS ======
router.get('/admin/system/commission', async (ctx) => {
  const [rows]: any = await pool.query('SELECT * FROM platform_commission_config ORDER BY id');
  ctx.body = { code: 200, message: '查询成功', data: rows.map((c: any) => ({ id: c.id, module: c.module, commissionRate: c.commission_rate, updatedAt: c.updated_at })) };
});

router.put('/admin/system/commission/:id', async (ctx) => {
  const { rate } = ctx.request.body as any;
  await pool.query('UPDATE platform_commission_config SET commission_rate = ? WHERE id = ?', [rate, ctx.params.id]);
  ctx.body = { code: 200, message: '已更新（仅对新订单生效）', data: null };
});

router.put('/admin/system/config', async (ctx) => {
  const { key, value } = ctx.request.body as any;
  await pool.query('INSERT INTO system_config (config_key, config_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE config_value = ?', [key, value, value]);
  ctx.body = { code: 200, message: '配置已更新', data: null };
});

router.get('/admin/system/sensitive-words', async (ctx) => {
  const page = Number(ctx.query.page) || 1;
  const pageSize = Number(ctx.query.pageSize) || 20;
  const offset = (page - 1) * pageSize;
  const [countRows]: any = await pool.query('SELECT COUNT(*) as total FROM sensitive_word');
  const [rows]: any = await pool.query('SELECT * FROM sensitive_word ORDER BY created_at DESC LIMIT ? OFFSET ?', [pageSize, offset]);
  ctx.body = { code: 200, message: '查询成功', data: { list: rows.map((w: any) => ({ id: w.id, word: w.word, category: w.category || '', createdAt: w.created_at })), total: countRows[0]?.total || 0, page, pageSize } };
});

router.post('/admin/system/sensitive-words', async (ctx) => {
  const { word, category } = ctx.request.body as any;
  await pool.query('INSERT INTO sensitive_word (word, category) VALUES (?, ?)', [word, category || '']);
  ctx.body = { code: 200, message: '添加成功', data: null };
});

router.delete('/admin/system/sensitive-words/:id', async (ctx) => {
  await pool.query('DELETE FROM sensitive_word WHERE id = ?', [ctx.params.id]);
  ctx.body = { code: 200, message: '删除成功', data: null };
});

router.post('/admin/system/sensitive-words/batch', async (ctx) => {
  const { words } = ctx.request.body as any;
  if (words?.length) {
    const values = words.map((w: string) => [w]);
    await pool.query('INSERT IGNORE INTO sensitive_word (word) VALUES ?', [values]);
  }
  ctx.body = { code: 200, message: `已导入${words?.length || 0}个`, data: null };
});

router.get('/admin/system/shipping', async (ctx) => {
  const [rows]: any = await pool.query('SELECT * FROM shipping_template ORDER BY id');
  ctx.body = { code: 200, message: '查询成功', data: rows };
});

router.post('/admin/system/shipping', async (ctx) => {
  const { name, defaultFee, freeThreshold } = ctx.request.body as any;
  await pool.query('INSERT INTO shipping_template (name, default_fee, free_threshold) VALUES (?, ?, ?)', [name, defaultFee || 0, freeThreshold || 0]);
  ctx.body = { code: 200, message: '创建成功', data: null };
});

router.put('/admin/system/shipping/:id', async (ctx) => {
  const { name, defaultFee, freeThreshold } = ctx.request.body as any;
  await pool.query('UPDATE shipping_template SET name=?, default_fee=?, free_threshold=? WHERE id=?', [name, defaultFee || 0, freeThreshold || 0, ctx.params.id]);
  ctx.body = { code: 200, message: '更新成功', data: null };
});

// ====== OPERATION LOGS ======
router.get('/admin/logs', async (ctx) => {
  const page = Number(ctx.query.page) || 1;
  const pageSize = Number(ctx.query.pageSize) || 20;
  const offset = (page - 1) * pageSize;
  const [countRows]: any = await pool.query('SELECT COUNT(*) as total FROM admin_operation_log');
  const [rows]: any = await pool.query('SELECT * FROM admin_operation_log ORDER BY created_at DESC LIMIT ? OFFSET ?', [pageSize, offset]);
  ctx.body = { code: 200, message: '查询成功', data: { list: rows.map((l: any) => ({ id: l.id, operatorId: l.operator_id, operatorName: l.operator_name, actionType: l.action_type, targetType: l.target_type, targetId: l.target_id, actionDetail: l.action_detail, ip: l.ip, createdAt: l.created_at })), total: countRows[0]?.total || 0, page, pageSize } };
});

// ====== MERCHANT ======
router.post('/merchant/auth/login', async (ctx) => {
  const { username, password } = ctx.request.body as any;
  const [rows]: any = await pool.query('SELECT * FROM merchant WHERE username = ?', [username]);
  if (!rows.length) { ctx.body = { code: 401, message: '用户名或密码错误', data: null }; return; }
  const m = rows[0];
  const valid = await bcrypt.compare(password, m.password_hash);
  if (!valid) { ctx.body = { code: 401, message: '用户名或密码错误', data: null }; return; }
  const payload = { userId: m.id, username: m.username, role: 'merchant', roleId: 0 };
  const token = signToken(payload);
  ctx.body = { code: 200, message: '登录成功', data: { token, expiresIn: 604800, merchantInfo: { id: m.id, shopName: m.shop_name, module: m.module, contactName: m.contact_name } } };
});

router.get('/merchant/workbench', async (ctx) => {
  const today = new Date().toISOString().split('T')[0];
  const [[todayStats]]: any = await pool.query(
    `SELECT
       COUNT(*) as todayOrders,
       COALESCE(SUM(amount), 0) as revenue
     FROM orders WHERE DATE(created_at) = ? AND status != 'cancelled'`,
    [today]
  );
  const [[pendingStats]]: any = await pool.query(
    "SELECT COUNT(*) as pendingShip FROM orders WHERE status = 'paid'"
  );
  const [[refundStats]]: any = await pool.query(
    "SELECT COUNT(*) as pendingRefund FROM orders WHERE status = 'refunding'"
  );

  const [recentOrders]: any = await pool.query(
    "SELECT id, order_no, module, amount, status, created_at FROM orders ORDER BY created_at DESC LIMIT 10"
  );

  ctx.body = {
    code: 200, message: '查询成功',
    data: {
      todayOrders: Number(todayStats.todayOrders),
      pendingShip: Number(pendingStats.pendingShip),
      pendingRefund: Number(refundStats.pendingRefund),
      revenue: Number(todayStats.revenue),
      recentOrders: recentOrders.map((o: any) => ({
        id: o.id, orderNo: o.order_no, module: o.module,
        amount: Number(o.amount), status: o.status, createdAt: o.created_at,
      })),
    },
  };
});

router.put('/merchant/store', async (ctx) => {
  const { shopName, contactName, contactPhone, contactEmail, shopDescription } = ctx.request.body as any;
  const token = ctx.get('Authorization')?.slice(7);
  let merchantId = 1;
  if (token) {
    try {
      const payload: any = jwt.verify(token, JWT_SECRET);
      if (payload.role === 'merchant') merchantId = payload.userId;
    } catch {}
  }
  await pool.query('UPDATE merchant SET shop_name=?, contact_name=?, contact_phone=?, contact_email=?, shop_description=? WHERE id=?',
    [shopName, contactName, contactPhone, contactEmail || '', shopDescription || '', merchantId]);
  ctx.body = { code: 200, message: '店铺信息已更新', data: null };
});

router.get('/merchant/stats', async (ctx) => {
  const token = ctx.get('Authorization')?.slice(7);
  let merchantId = 1;
  if (token) {
    try {
      const payload: any = jwt.verify(token, JWT_SECRET);
      if (payload.role === 'merchant') merchantId = payload.userId;
    } catch {}
  }

  const [[{ totalSales, totalOrders }]]: any = await pool.query(
    "SELECT COALESCE(SUM(amount), 0) as totalSales, COUNT(*) as totalOrders FROM orders WHERE merchant_id = ? AND status != 'cancelled'",
    [merchantId]
  );

  // 近7日销售趋势
  const [salesTrend]: any = await pool.query(
    `SELECT DATE(created_at) as date, COALESCE(SUM(amount), 0) as amount
     FROM orders WHERE merchant_id = ? AND created_at >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
     GROUP BY DATE(created_at) ORDER BY date`,
    [merchantId]
  );

  // 订单状态分布
  const [orderStats]: any = await pool.query(
    `SELECT status, COUNT(*) as count FROM orders WHERE merchant_id = ? GROUP BY status`,
    [merchantId]
  );

  ctx.body = {
    code: 200, message: '查询成功',
    data: {
      totalSales: Number(totalSales),
      totalOrders: Number(totalOrders),
      goodRate: 98,
      pageViews: 0,
      salesTrend: salesTrend.map((s: any) => ({
        date: s.date instanceof Date ? s.date.toISOString().split('T')[0] : String(s.date).substring(0, 10),
        amount: Number(s.amount),
      })),
      orderStats: orderStats.map((s: any) => ({ status: s.status, count: s.count })),
    },
  };
});

router.get('/merchant/messages', async (ctx) => {
  const [rows]: any = await pool.query(
    'SELECT * FROM system_message WHERE user_id IS NULL OR user_id = 0 ORDER BY created_at DESC LIMIT 20'
  );
  const [countRows]: any = await pool.query('SELECT COUNT(*) as total FROM system_message');
  ctx.body = {
    code: 200, message: '查询成功',
    data: {
      list: rows.map((m: any) => ({
        id: m.id, type: m.type, title: m.title, content: m.content,
        isRead: m.is_read, createdAt: m.created_at,
      })),
      total: countRows[0]?.total || 0,
    },
  };
});

router.put('/merchant/account/password', async (ctx) => {
  const { oldPassword, newPassword } = ctx.request.body as any;
  if (!newPassword) { ctx.body = { code: 400, message: '新密码不能为空', data: null }; return; }
  const hash = await bcrypt.hash(newPassword, 12);
  await pool.query('UPDATE merchant SET password_hash = ? WHERE id = 1', [hash]);
  ctx.body = { code: 200, message: '密码已修改', data: null };
});

// ====== PUBLIC ======
router.get('/public/homepage', async (ctx) => {
  const [banners]: any = await pool.query('SELECT * FROM banner WHERE status = ? ORDER BY sort_order', ['published']);
  const [announcements]: any = await pool.query('SELECT * FROM announcement WHERE status = ? ORDER BY created_at DESC LIMIT 3', ['published']);
  ctx.body = {
    code: 200, message: '查询成功',
    data: {
      banners: banners.map((b: any) => ({ id: b.id, title: b.title, imageUrl: b.image_url, linkUrl: b.link_url, sortOrder: b.sort_order })),
      announcements: announcements.map((a: any) => ({ id: a.id, title: a.title, content: a.content })),
      activities: [], recommendations: [],
    },
  };
});

router.post('/public/merchant-applications', async (ctx) => {
  const { shopName, module, contactName, contactPhone, contactEmail, shopDescription, materials } = ctx.request.body as any;
  await pool.query('INSERT INTO merchant_application (user_id, shop_name, module, contact_name, contact_phone, contact_email, shop_description, materials, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [0, shopName, module, contactName, contactPhone, contactEmail || '', shopDescription || '', JSON.stringify(materials || []), 'pending']);
  ctx.body = { code: 200, message: '申请已提交，请等待审核', data: null };
});

router.get('/public/cultural-stories', async (ctx) => {
  ctx.body = { code: 200, message: 'ok', data: [
    { id: 1, title: '苗族银饰锻造技艺', image: '', description: '苗族银饰以其精湛的锻造技艺闻名。' },
    { id: 2, title: '蜡染：蓝白之间的艺术', image: '', description: '苗族蜡染以蜂蜡为墨、蓝靛为彩。' },
  ]};
});

router.get('/public/travelogues/hot', async (ctx) => {
  ctx.body = { code: 200, message: 'ok', data: { list: [], total: 0, page: 1, pageSize: 10 } };
});

// ====== START ======
app.use(router.routes());
app.use(router.allowedMethods());

const PORT = 7001;
app.listen(PORT, () => {
  console.log(`✅ 乌东文旅后端已启动: http://localhost:${PORT}/api`);
  console.log(`   MySQL: wudong_travel_dev @ 127.0.0.1:3306`);
  console.log(`   管理员: admin / admin123`);
});
