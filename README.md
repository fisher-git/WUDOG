# 乌东文旅「衣食住行」综合服务平台 — 模块6：平台管理后台

贵州黔东南苗族侗族自治州乌东苗寨一站式数字化文旅服务平台。本仓库实现**第6模块——平台管理后台**的四端交付：后端API、后台管理端、PC Web端、微信小程序端。

## 技术架构

```
┌──────────┐   ┌──────────┐   ┌───────────────┐
│ 后台管理端 │   │ PC Web端  │   │  微信小程序端   │
│ React+AD  │   │ React 18 │   │  原生 WXML     │
│ :3000     │   │ :5174     │   │               │
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
              │  MySQL 8.0    │
              └───────────────┘
```

| 层 | 技术栈 |
|---|---|
| **后端** | Koa2 + TypeScript + MySQL2（真实数据库读写） |
| **后台管理端** | React 18 + Ant Design 5 + ECharts |
| **PC Web端** | React 18 + Ant Design 5 |
| **微信小程序** | 原生 WXML/WXSS/TypeScript |
| **构建工具** | Vite + tsx + npm workspaces |

## 功能范围

### 管理员后台 (11.3)
| 子系统 | 功能 | API路径 |
|---|---|---|
| 🔐 登录认证 | 图形验证码 + bcrypt 密码验证 | `/api/admin/auth/*` |
| 👥 用户管理 | 游客列表/详情、商家管理 | `/api/admin/users/*` |
| 🔑 角色权限 | RBAC 角色增删改、权限分配 | `/api/admin/roles/*` |
| 📋 商家审核 | 入驻申请列表/详情、通过/驳回 | `/api/admin/audit/*` |
| 📊 数据看板 | DAU/GMV/订单图表 | `/api/admin/dashboard/*` |
| 🎨 首页运营 | 轮播图/公告/活动/推荐位 CRUD | `/api/admin/homepage/*` |
| 💬 消息中心 | 消息发送/模板管理/历史查询 | `/api/admin/messages/*` |
| 💰 财务结算 | 结算单生成/确认 (T+7/T+15) | `/api/admin/finance/*` |
| 📦 全局订单 | 跨模块订单查询/退款审批 | `/api/admin/orders/*` |
| ⚙️ 系统设置 | 抽佣/运费/支付/短信/敏感词 | `/api/admin/system/*` |
| 📝 操作日志 | 管理员操作追溯 | `/api/admin/logs/*` |

### 商家后台框架 (11.4)
商家登录 → 工作台(今日订单/营业额) → 店铺信息 → 数据统计(图表) → 消息通知 → 账号设置

### 公共框架 (5.8)
- **PC Web首页**: 全屏轮播 → 住宿搜索 → 热门路线 → 精选非遗 → 美食推荐 → 游记瀑布流
- **小程序首页**: 搜索栏 → 轮播图 → 5分类入口 → 热门推荐 → 文化故事 → 游记瀑布流 → Tab导航

## 快速启动

### 环境要求
- Node.js 18+
- npm 9+
- MySQL 8.0+（需运行中）

### 1. 安装依赖
```bash
cd WUDOG
npm install
```

### 2. 初始化数据库
```bash
mysql -u root -p < server/migrations/V1__init_module6_tables.sql
```
数据库配置在 `server/src/standalone.ts` 第15-20行（默认 root/123456，端口3306）。

### 3. 启动服务
```bash
npm run dev:server   # 后端 :7001
npm run dev:admin    # 后台管理端 :3000
npm run dev:web      # PC Web :5174
```

### 4. 访问
| 服务 | 地址 | 账号 |
|---|---|---|
| 后台管理端 | http://localhost:3000 | admin / admin123 |
| PC Web端 | http://localhost:5174 | 游客浏览 |
| API | http://localhost:7001/api | — |

### 5. 微信小程序
用**微信开发者工具**打开 `miniprogram/` 目录，替换 `project.config.json` 中的 `appid` 为你的测试号。

## 项目结构

```
├── shared/                     # 共享类型 (@wudong/shared)
│   └── src/                    # ApiResponse<T>, 枚举, DTO
├── server/                     # 后端 Koa2 (600+ 行)
│   ├── src/standalone.ts       # 全部 API 端点
│   └── migrations/             # 19张表 + 种子数据 SQL
├── admin/                      # 后台管理端 React
│   └── src/
│       ├── App.tsx             # 完整路由树
│       ├── layouts/            # AdminLayout, MerchantLayout
│       ├── pages/login/        # 图形验证码登录
│       ├── pages/admin/        # 20个管理页面
│       │   ├── Dashboard/      # 数据看板 (ECharts)
│       │   ├── UserManagement/ # 用户管理
│       │   ├── Audit/          # 商家审核
│       │   ├── HomepageOps/    # 首页运营 CRUD
│       │   ├── MessageCenter/  # 消息中心
│       │   ├── Finance/        # 财务结算
│       │   ├── GlobalOrders/   # 全局订单
│       │   └── SystemSettings/ # 系统设置
│       └── pages/merchant/     # 5个商家页面
├── web/                        # PC Web端 React
│   └── src/components/         # Banner/Routes/Crafts/Food
├── miniprogram/                # 微信小程序
│   ├── pages/                  # 首页/搜索/购物车/我的/登录
│   └── components/             # banner/category/recommend...
└── package.json                # npm workspaces 根配置
```

## 数据库表 (19张)

`admin_user`, `admin_role`, `admin_permission`, `admin_role_permission`, `merchant`, `merchant_application`, `banner`, `announcement`, `activity_banner`, `recommendation_slot`, `system_message`, `message_template`, `settlement_record`, `settlement_sheet`, `platform_commission_config`, `system_config`, `sensitive_word`, `shipping_template`, `admin_operation_log`

## API 规范

所有接口返回统一格式：
```json
{ "code": 200, "message": "成功", "data": {} }
```

主要接口前缀：
- `/api/admin/*` — 管理员后台
- `/api/merchant/*` — 商家后台
- `/api/public/*` — 公开接口

## 业务规则

| 编号 | 规则 |
|---|---|
| R11-01 | 管理员登录需图形验证码 |
| R11-02 | 所有管理员操作记日志，不可删 |
| R11-03 | 商家入驻审核 < 3个工作日 |
| R11-04 | 抽佣修改仅对新订单生效 |
| R11-05 | T+7 (门票/线路) / T+15 (商品/餐厅/民宿) 结算 |
| R11-06 | RBAC 权限模型 |
