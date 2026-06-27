# 乌东文旅「衣食住行」综合服务平台 — 模块6：平台管理后台

贵州黔东南苗族侗族自治州乌东苗寨一站式数字化文旅服务平台。本仓库实现**第6模块——平台管理后台**的四端交付：后端API、后台管理端、PC Web端、微信小程序端。

## 技术架构

```
┌──────────┐   ┌──────────┐   ┌───────────────┐
│ 后台管理端 │   │ PC Web端  │   │  微信小程序端   │
│ React+AD  │   │ React 18 │   │  原生 WXML     │
│ :3002     │   │ :5174     │   │               │
└─────┬─────┘   └────┬─────┘   └───────┬───────┘
      │               │                 │
      └───────────────┼─────────────────┘
                      │ HTTP REST
              ┌───────┴───────┐
              │  后端 Koa2    │  ← :7001
              │  TypeScript   │
              └───────┬───────┘
                      │ mysql2
              ┌───────┴───────┐
              │  MySQL 8.0    │  ← 127.0.0.1:3306
              │ wudong_travel │     root/123456
              └───────────────┘
```

| 层 | 技术栈 |
|---|---|
| **后端** | Koa2 + TypeScript + mysql2/promise（真实 MySQL 读写） |
| **后台管理端** | React 18 + Ant Design 5 + ECharts |
| **PC Web端** | React 18 + Ant Design 5 |
| **微信小程序** | 原生 WXML/WXSS/TypeScript |
| **构建工具** | Vite + tsx watch + npm workspaces |

## 功能范围

### 管理员后台 (11.3)

| 子系统 | 功能 | API路径 | 数据源 |
|---|---|---|---|
| 🔐 登录认证 | SVG图形验证码 + bcrypt + JWT | `/api/admin/auth/*` | `admin_user` 表 |
| 📊 数据看板 | DAU/新增用户/订单数/GMV/订单趋势/用户增长/内容统计/商家排行/财务概览 | `/api/admin/dashboard/overview` | `orders`, `admin_user`, `merchant`, `settlement_sheet` 等 实表实时查询 |
| 👥 用户管理 | 游客列表(分页+筛选)/详情(含订单统计)/封禁解封、商家列表/详情/状态管理 | `/api/admin/users/*` | `admin_user`, `merchant` 表 |
| 🔑 角色权限 | RBAC 角色增删改、权限树分配 | `/api/admin/roles/*` | `admin_role`, `admin_permission`, `admin_role_permission` 表 |
| 📋 商家审核 | 入驻申请列表(Tab筛选)/资质材料预览/通过(分配模块)/驳回(填写原因) | `/api/admin/audit/*` | `merchant_application` 表 |
| 🎨 首页运营 | 轮播图/公告/活动横幅/推荐位 完整CRUD | `/api/admin/homepage/*` | `banner`, `announcement`, `activity_banner`, `recommendation_slot` 表 |
| 💬 消息中心 | 消息群发/指定发送/模板管理/历史查询 | `/api/admin/messages/*` | `system_message`, `message_template` 表 |
| 💰 财务结算 | 结算单列表/详情(含明细记录)/生成/确认 | `/api/admin/finance/*` | `settlement_sheet`, `settlement_record` 表 |
| 📦 全局订单 | 跨模块查询(分页+模块/状态/关键词筛选)/订单详情/退款审批 | `/api/admin/orders/*` | `orders` 表 |
| ⚙️ 系统设置 | 抽佣比例/运费模板/支付配置/短信配置/敏感词库 | `/api/admin/system/*` | `platform_commission_config`, `system_config`, `sensitive_word`, `shipping_template` 表 |
| 📝 操作日志 | 自动记录管理员操作，支持分页查询 | `/api/admin/logs/*` | `admin_operation_log` 表 |

### 商家后台框架 (11.4)

| 页面 | 功能 | API路径 |
|---|---|---|
| 工作台 | 今日订单/待发货/待退款/营业额/最近订单 | `/api/merchant/workbench` |
| 店铺信息 | 编辑店铺名称/联系人/联系方式/描述 | `/api/merchant/store` |
| 数据统计 | 总销售额/总订单/好评率/销售趋势图 | `/api/merchant/stats` |
| 消息通知 | 系统消息/订单通知列表 | `/api/merchant/messages` |
| 账号设置 | 修改密码 (bcrypt 加密) | `/api/merchant/account/password` |

### 公共前端框架 (5.8)

- **PC Web首页**: 全屏轮播 → 住宿搜索 → 热门路线 → 精选非遗 → 美食推荐 → 游记瀑布流
- **小程序首页**: 搜索栏 → 轮播图 → 5分类入口 → 热门推荐 → 文化故事 → 游记瀑布流 → Tab导航
- **公开API**: `/api/public/homepage`, `/api/public/merchant-applications`, `/api/public/cultural-stories`, `/api/public/travelogues/hot`

## 快速启动

### 环境要求

- Node.js 18+
- npm 9+
- MySQL 8.0+（需运行中，默认端口 3306）
- 数据库密码：`123456`（可在 `server/src/standalone.ts` 第15-20行修改）

### 1. 克隆并安装依赖

```bash
git clone git@github.com:fisher-git/WUDOG.git
cd WUDOG
npm install
```

### 2. 初始化数据库

```bash
# 建表 + 基础种子数据（管理员、角色、权限、抽佣配置、敏感词、消息模板）
mysql -u root -p123456 --default-character-set=utf8mb4 < server/migrations/V1__init_module6_tables.sql

# 仪表盘种子数据（70条订单、8个商家、7条入驻申请、结算数据、运营内容、操作日志等）
mysql -u root -p123456 --default-character-set=utf8mb4 < server/migrations/V2__seed_dashboard_data.sql
```

### 3. 启动服务

```bash
npm run dev:server   # 后端 API :7001
npm run dev:admin    # 后台管理端 :3002
npm run dev:web      # PC Web端 :5174
```

### 4. 访问

| 服务 | 地址 | 账号 |
|---|---|---|
| 后台管理端 | http://localhost:3002 | admin / admin123 |
| PC Web端 | http://localhost:5174 | 游客浏览 |
| API | http://localhost:7001/api | — |

### 5. 微信小程序

用**微信开发者工具**打开 `miniprogram/` 目录，替换 `project.config.json` 中的 `appid` 为你的测试号。

## 项目结构

```
├── shared/                          # 共享类型包 (@wudong/shared)
│   └── src/                         # ApiResponse<T>, 枚举, DTO 类型
├── server/                          # 后端 Koa2 (850+ 行)
│   ├── src/standalone.ts            # 全部 API 端点（单文件部署）
│   └── migrations/
│       ├── V1__init_module6_tables.sql    # 19张表建表 + 基础种子
│       └── V2__seed_dashboard_data.sql    # 仪表盘展示用种子数据
├── admin/                           # 后台管理端 React
│   └── src/
│       ├── App.tsx                  # 完整路由树（管理+商家 2套路由）
│       ├── layouts/                 # AdminLayout, MerchantLayout
│       ├── pages/login/             # SVG 图形验证码登录
│       ├── pages/admin/
│       │   ├── Dashboard/           # 数据看板 (ECharts，真实MySQL数据)
│       │   ├── UserManagement/      # TouristList, MerchantList, UserDetail
│       │   ├── RolePermission/      # RBAC 角色权限配置
│       │   ├── OperationLog/        # 操作日志查询
│       │   ├── Audit/               # 入驻申请列表 + 详情审核
│       │   ├── HomepageOps/         # 轮播图/公告/活动/推荐位 CRUD
│       │   ├── MessageCenter/       # 消息发送/模板/历史
│       │   ├── Finance/             # 结算列表 + 详情
│       │   ├── GlobalOrders/        # 全局订单列表 + 详情
│       │   └── SystemSettings/      # 抽佣/运费/支付/短信/敏感词
│       ├── pages/merchant/          # 商家后台 5个页面
│       ├── components/
│       │   ├── AdminSidebar.tsx     # 管理员侧边导航
│       │   ├── AdminHeader.tsx      # 管理员顶栏
│       │   ├── charts/              # LineChart/BarChart/PieChart/FunnelChart
│       │   └── common/              # ProtectedRoute 路由守卫
│       ├── services/                # API 调用封装 (axios)
│       └── hooks/                   # useAuth, usePermission
├── web/                             # PC Web端 React
│   └── src/
│       ├── pages/home/              # 首页（6大区域组件组装）
│       ├── pages/login/             # 用户登录
│       ├── pages/register/          # 用户注册
│       ├── pages/merchant-apply/    # 商家入驻申请
│       └── components/              # Banner/Routes/Crafts/Food 等组件
├── miniprogram/                     # 微信小程序
│   ├── pages/                       # 首页/搜索/购物车/我的/登录
│   └── components/                  # banner/category/hot-recommendations 等
├── package.json                     # npm workspaces 根配置
└── README.md
```

## 数据库表 (20张)

| 表名 | 说明 | 数据量 |
|---|---|---|
| `admin_user` | 管理员用户 | 7 条 |
| `admin_role` | 角色 | 3 条 |
| `admin_permission` | 权限列表 | 18 条 |
| `admin_role_permission` | 角色-权限关联 | 18 条 |
| `merchant` | 商家 | 8 条 |
| `merchant_application` | 商家入驻申请 | 7 条 |
| `orders` | 订单（跨模块） | 70 条 |
| `banner` | 首页轮播图 | 5 条 |
| `announcement` | 平台公告 | 4 条 |
| `activity_banner` | 活动横幅 | 3 条 |
| `recommendation_slot` | 首页推荐位 | 6 条 |
| `system_message` | 系统消息 | 9 条 |
| `message_template` | 消息模板 | 3 条 |
| `settlement_record` | 结算记录 | 9 条 |
| `settlement_sheet` | 结算单 | 8 条 |
| `platform_commission_config` | 抽佣配置 | 4 条 |
| `system_config` | 系统配置 | 5 条 |
| `sensitive_word` | 敏感词库 | 3 条 |
| `shipping_template` | 运费模板 | 3 条 |
| `admin_operation_log` | 操作日志 | 10 条 |

**数据库名**: `wudong_travel_dev` | **字符集**: `utf8mb4` | **引擎**: InnoDB

## API 规范

所有接口返回统一格式：
```json
{ "code": 200, "message": "成功", "data": {} }
```

### 主要接口前缀

| 前缀 | 用途 | 示例 |
|---|---|---|
| `/api/admin/auth/*` | 管理员认证 | `POST /api/admin/auth/login` |
| `/api/admin/dashboard/*` | 数据看板 | `GET /api/admin/dashboard/overview` |
| `/api/admin/users/*` | 用户管理 | `GET /api/admin/users/tourists` |
| `/api/admin/roles/*` | 角色权限 | `GET /api/admin/roles` |
| `/api/admin/audit/*` | 商家审核 | `GET /api/admin/audit/applications` |
| `/api/admin/homepage/*` | 首页运营 | `GET /api/admin/homepage/banners` |
| `/api/admin/messages/*` | 消息中心 | `POST /api/admin/messages/send` |
| `/api/admin/finance/*` | 财务结算 | `GET /api/admin/finance/settlements` |
| `/api/admin/orders/*` | 全局订单 | `GET /api/admin/orders` |
| `/api/admin/system/*` | 系统设置 | `GET /api/admin/system/commission` |
| `/api/admin/logs/*` | 操作日志 | `GET /api/admin/logs` |
| `/api/merchant/*` | 商家后台 | `GET /api/merchant/workbench` |
| `/api/public/*` | 公开接口 | `GET /api/public/homepage` |

### 认证方案

- **管理员登录**: 用户名 + 密码 (bcrypt) + SVG图形验证码
- **JWT Token**: 有效期7天，请求头 `Authorization: Bearer <token>`
- **商家登录**: 用户名 + 密码 (bcrypt)

## 业务规则

| 编号 | 规则 | 实现 |
|---|---|---|
| R11-01 | 管理员登录需图形验证码 | SVG 4位字母数字，5分钟有效期，点击刷新 |
| R11-02 | 所有管理员操作记日志，不可删 | 封禁/解封/审核等操作自动写入 `admin_operation_log` |
| R11-03 | 商家入驻审核 < 3个工作日 | 申请状态 tracking (pending/approved/rejected) |
| R11-04 | 抽佣修改仅对新订单生效 | 更新 `commission_rate` 字段，历史订单佣金不变 |
| R11-05 | T+7 / T+15 结算 | 结算单按周期生成，支持确认/付款流转 |
| R11-06 | RBAC 权限模型 | 角色-权限树，超级管理员(role_id=1)不可删改 |

## 常见问题

**Q: 登录提示"验证码错误"？**
A: 验证码区分大小写（自动转大写），过期需点击图片刷新。

**Q: 仪表盘数据为空？**
A: 确保已执行 V2 种子数据迁移：`mysql -u root -p123456 --default-character-set=utf8mb4 < server/migrations/V2__seed_dashboard_data.sql`

**Q: 中文显示乱码？**
A: MySQL 连接需指定 `--default-character-set=utf8mb4`，数据库默认字符集为 `utf8mb4_unicode_ci`。

**Q: 端口冲突？**
A: 后台管理端默认 3002（3000/3001 可能被占用）。可在 `admin/vite.config.ts` 中修改。

**Q: 如何重置数据库？**
```bash
mysql -u root -p123456 -e "DROP DATABASE IF EXISTS wudong_travel_dev; CREATE DATABASE wudong_travel_dev DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
mysql -u root -p123456 --default-character-set=utf8mb4 wudong_travel_dev < server/migrations/V1__init_module6_tables.sql
mysql -u root -p123456 --default-character-set=utf8mb4 wudong_travel_dev < server/migrations/V2__seed_dashboard_data.sql
```
