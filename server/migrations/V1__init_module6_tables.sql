-- ============================================
-- 乌东文旅 Module 6: 平台管理后台 数据库初始化
-- ============================================

CREATE DATABASE IF NOT EXISTS wudong_travel_dev DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE wudong_travel_dev;

-- 管理员账号
CREATE TABLE admin_user (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password_hash VARCHAR(500) NOT NULL,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  role_id BIGINT,
  status ENUM('active','disabled') DEFAULT 'active',
  last_login_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 角色
CREATE TABLE admin_role (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  description VARCHAR(255),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 权限
CREATE TABLE admin_permission (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(100) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  perm_group VARCHAR(50),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 角色-权限关联
CREATE TABLE admin_role_permission (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  role_id BIGINT NOT NULL,
  permission_id BIGINT NOT NULL,
  UNIQUE KEY uk_role_perm (role_id, permission_id)
) ENGINE=InnoDB;

-- 商家
CREATE TABLE merchant (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password_hash VARCHAR(500) NOT NULL,
  shop_name VARCHAR(100) NOT NULL,
  module ENUM('clothing','food','lodging','travel'),
  contact_name VARCHAR(50),
  contact_phone VARCHAR(20),
  contact_email VARCHAR(100),
  shop_description TEXT,
  status ENUM('active','suspended','closed') DEFAULT 'active',
  settled_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 商家入驻申请
CREATE TABLE merchant_application (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT NOT NULL,
  shop_name VARCHAR(100) NOT NULL,
  module ENUM('clothing','food','lodging','travel'),
  contact_name VARCHAR(50),
  contact_phone VARCHAR(20),
  contact_email VARCHAR(100),
  shop_description TEXT,
  materials JSON,
  status ENUM('pending','approved','rejected') DEFAULT 'pending',
  reviewer_id BIGINT,
  review_comment TEXT,
  reviewed_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 轮播图
CREATE TABLE banner (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  image_url VARCHAR(500) NOT NULL,
  link_url VARCHAR(500),
  sort_order INT DEFAULT 0,
  status ENUM('draft','published','archived') DEFAULT 'published',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 平台公告
CREATE TABLE announcement (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  published_at DATETIME,
  status ENUM('draft','published','archived') DEFAULT 'draft',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 活动横幅
CREATE TABLE activity_banner (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  image_url VARCHAR(500) NOT NULL,
  link_url VARCHAR(500),
  start_time DATETIME NOT NULL,
  end_time DATETIME NOT NULL,
  status ENUM('draft','published','archived') DEFAULT 'draft',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 推荐位
CREATE TABLE recommendation_slot (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  slot_name VARCHAR(100) NOT NULL,
  content_type VARCHAR(50) NOT NULL,
  content_id BIGINT NOT NULL,
  sort_order INT DEFAULT 0,
  status ENUM('draft','published','archived') DEFAULT 'published',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 系统消息
CREATE TABLE system_message (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT,
  type ENUM('system','order','refund','notification') NOT NULL,
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 消息模板
CREATE TABLE message_template (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  title_template VARCHAR(200) NOT NULL,
  content_template TEXT NOT NULL,
  type ENUM('system','order','refund','notification') NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 财务结算记录
CREATE TABLE settlement_record (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  order_id BIGINT NOT NULL,
  merchant_id BIGINT NOT NULL,
  merchant_name VARCHAR(100),
  order_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  commission_rate DECIMAL(5,2) NOT NULL DEFAULT 0,
  commission_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  merchant_income DECIMAL(10,2) NOT NULL DEFAULT 0,
  status ENUM('pending','confirmed','paid') DEFAULT 'pending',
  settled_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 结算单
CREATE TABLE settlement_sheet (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  merchant_id BIGINT NOT NULL,
  merchant_name VARCHAR(100),
  period VARCHAR(20) NOT NULL,
  total_orders INT DEFAULT 0,
  total_amount DECIMAL(12,2) DEFAULT 0,
  total_commission DECIMAL(12,2) DEFAULT 0,
  total_income DECIMAL(12,2) DEFAULT 0,
  status ENUM('pending','confirmed','paid') DEFAULT 'pending',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 平台抽佣配置
CREATE TABLE platform_commission_config (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  module ENUM('clothing','food','lodging','travel') NOT NULL UNIQUE,
  commission_rate DECIMAL(5,2) NOT NULL DEFAULT 10.00,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 系统配置
CREATE TABLE system_config (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  config_key VARCHAR(50) NOT NULL UNIQUE,
  config_value TEXT,
  description VARCHAR(100),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 敏感词库
CREATE TABLE sensitive_word (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  word VARCHAR(100) NOT NULL UNIQUE,
  category VARCHAR(50),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 运费模板
CREATE TABLE shipping_template (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  default_fee DECIMAL(8,2) DEFAULT 0,
  free_threshold DECIMAL(8,2) DEFAULT 0,
  region_rules TEXT,
  status ENUM('published','archived') DEFAULT 'published',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 操作日志
CREATE TABLE admin_operation_log (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  operator_id BIGINT NOT NULL,
  operator_name VARCHAR(50),
  action_type VARCHAR(50) NOT NULL,
  target_type VARCHAR(100),
  target_id BIGINT,
  action_detail TEXT,
  ip VARCHAR(50),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ============================================
-- 种子数据
-- ============================================

-- 超级管理员 (密码: admin123, bcrypt cost=12)
INSERT INTO admin_user (username, password_hash, name, phone, role_id, status) VALUES
('admin', '$2a$12$LJ3m4ys3Lk0TSwHBQRSMfOBbOdBNJZpNTqWxr5U7VJynCZgGcVdG6', '超级管理员', '13800000000', 1, 'active');

-- 默认角色
INSERT INTO admin_role (id, name, description) VALUES
(1, '超级管理员', '拥有所有权限'),
(2, '运营管理员', '日常运营管理权限'),
(3, '财务管理员', '财务管理权限');

-- 权限列表
INSERT INTO admin_permission (code, name, perm_group) VALUES
('user:view', '查看用户', '用户管理'),
('user:edit', '编辑用户', '用户管理'),
('user:ban', '封禁/解封用户', '用户管理'),
('merchant:view', '查看商家', '商家管理'),
('merchant:edit', '编辑商家', '商家管理'),
('merchant:status', '修改商家状态', '商家管理'),
('audit:view', '查看审核', '商家审核'),
('audit:approve', '审批入驻', '商家审核'),
('dashboard:view', '查看数据看板', '数据看板'),
('homepage:manage', '首页运营管理', '首页运营'),
('message:send', '发送消息', '消息中心'),
('message:template', '管理消息模板', '消息中心'),
('finance:view', '查看财务', '财务结算'),
('finance:settle', '生成结算单', '财务结算'),
('order:view', '查看全局订单', '全局订单'),
('order:refund', '退款审批', '全局订单'),
('system:config', '系统设置', '系统设置'),
('log:view', '查看操作日志', '操作日志');

-- 超级管理员拥有所有权限
INSERT INTO admin_role_permission (role_id, permission_id)
SELECT 1, id FROM admin_permission;

-- 默认抽佣配置 (衣10%, 食8%, 住12%, 行8%)
INSERT INTO platform_commission_config (module, commission_rate) VALUES
('clothing', 10.00),
('food', 8.00),
('lodging', 12.00),
('travel', 8.00);

-- 默认敏感词
INSERT INTO sensitive_word (word, category) VALUES
('违禁词1', '通用'),
('违禁词2', '通用'),
('测试敏感词', '测试');

-- 默认消息模板
INSERT INTO message_template (code, name, title_template, content_template, type) VALUES
('order_pay_success', '支付成功通知', '订单支付成功', '您的订单{{order_id}}已支付成功，金额{{amount}}元', 'order'),
('order_shipped', '订单发货通知', '订单已发货', '您的订单{{order_id}}已发货，物流公司{{company}}，运单号{{tracking_no}}', 'order'),
('refund_success', '退款成功通知', '退款已处理', '您的退款申请（订单{{order_id}}）已处理，退款金额{{amount}}元', 'refund');
