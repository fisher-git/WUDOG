-- ============================================
-- 乌东文旅 Module 6: 种子数据 - 仪表盘展示用
-- ============================================
USE wudong_travel_dev;

-- ============================================
-- 1. 订单表 (dashboard需要)
-- ============================================
CREATE TABLE IF NOT EXISTS `orders` (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  order_no VARCHAR(32) NOT NULL UNIQUE,
  module ENUM('clothing','food','lodging','travel') NOT NULL,
  merchant_id BIGINT,
  merchant_name VARCHAR(100),
  user_id BIGINT,
  user_name VARCHAR(100),
  amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  commission DECIMAL(10,2) DEFAULT 0,
  status ENUM('pending_pay','paid','confirmed','shipped','received','refunding','refunded','cancelled') DEFAULT 'pending_pay',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- 2. 更多管理员用户
-- ============================================
INSERT IGNORE INTO admin_user (username, password_hash, name, phone, role_id, status, created_at) VALUES
('zhangsan', '$2a$12$LJ3m4ys3Lk0TSwHBQRSMfOBbOdBNJZpNTqWxr5U7VJynCZgGcVdG6', '张三', '13800000001', 2, 'active', '2026-06-10 09:00:00'),
('lisi', '$2a$12$LJ3m4ys3Lk0TSwHBQRSMfOBbOdBNJZpNTqWxr5U7VJynCZgGcVdG6', '李四', '13800000002', 2, 'active', '2026-06-12 10:30:00'),
('wangwu', '$2a$12$LJ3m4ys3Lk0TSwHBQRSMfOBbOdBNJZpNTqWxr5U7VJynCZgGcVdG6', '王五', '13800000003', 3, 'active', '2026-06-15 14:00:00'),
('zhaoliu', '$2a$12$LJ3m4ys3Lk0TSwHBQRSMfOBbOdBNJZpNTqWxr5U7VJynCZgGcVdG6', '赵六', '13800000004', 2, 'active', '2026-06-18 08:20:00'),
('sunqi', '$2a$12$LJ3m4ys3Lk0TSwHBQRSMfOBbOdBNJZpNTqWxr5U7VJynCZgGcVdG6', '孙七', '13800000005', 3, 'active', '2026-06-20 16:30:00'),
('zhouba', '$2a$12$LJ3m4ys3Lk0TSwHBQRSMfOBbOdBNJZpNTqWxr5U7VJynCZgGcVdG6', '周八', '13800000006', 2, 'active', '2026-06-22 11:00:00');

-- ============================================
-- 3. 商家数据
-- ============================================
INSERT INTO merchant (username, password_hash, shop_name, module, contact_name, contact_phone, contact_email, shop_description, status, settled_at, created_at) VALUES
('merchant_miaozu_yinshi', '$2a$12$LJ3m4ys3Lk0TSwHBQRSMfOBbOdBNJZpNTqWxr5U7VJynCZgGcVdG6', '苗祖银饰工坊', 'clothing', '杨师傅', '13900001001', 'yang@yinshi.com', '传承三代苗族银饰锻造技艺，纯手工打造精美银饰', 'active', '2026-06-15 10:00:00', '2026-06-15 09:00:00'),
('merchant_qianhu_miaozhai', '$2a$12$LJ3m4ys3Lk0TSwHBQRSMfOBbOdBNJZpNTqWxr5U7VJynCZgGcVdG6', '千户苗寨客栈', 'lodging', '吴老板', '13900002001', 'wu@miaozhai.com', '位于西江千户苗寨核心区域，推窗即景，体验原生态苗寨生活', 'active', '2026-06-10 08:30:00', '2026-06-10 08:00:00'),
('merchant_miaowei_renjia', '$2a$12$LJ3m4ys3Lk0TSwHBQRSMfOBbOdBNJZpNTqWxr5U7VJynCZgGcVdG6', '苗味人家', 'food', '龙大厨', '13900003001', 'long@miaowei.com', '正宗苗族酸汤鱼、腊肉、糯米饭，地道黔东南风味', 'active', '2026-06-08 14:00:00', '2026-06-08 13:00:00'),
('merchant_shanli_leyuan', '$2a$12$LJ3m4ys3Lk0TSwHBQRSMfOBbOdBNJZpNTqWxr5U7VJynCZgGcVdG6', '山里乐游', 'travel', '潘导游', '13900004001', 'pan@shanleyou.com', '提供苗寨深度游、非遗体验游、梯田徒步等特色线路', 'active', '2026-06-12 11:00:00', '2026-06-12 10:30:00'),
('merchant_miaoxiu_fang', '$2a$12$LJ3m4ys3Lk0TSwHBQRSMfOBbOdBNJZpNTqWxr5U7VJynCZgGcVdG6', '苗绣坊', 'clothing', '刘绣娘', '13900005001', 'liu@miaoxiu.com', '苗族刺绣非遗传承人，手工刺绣服饰、包包、挂件', 'active', '2026-06-18 09:00:00', '2026-06-18 08:30:00'),
('merchant_guzhen_kezhan', '$2a$12$LJ3m4ys3Lk0TSwHBQRSMfOBbOdBNJZpNTqWxr5U7VJynCZgGcVdG6', '古镇客栈', 'lodging', '陈老板', '13900006001', 'chen@guzhen.com', '镇远古镇河畔客栈，明清古建筑改造，临河观景', 'active', '2026-06-20 15:00:00', '2026-06-20 14:00:00'),
('merchant_laya_meishi', '$2a$12$LJ3m4ys3Lk0TSwHBQRSMfOBbOdBNJZpNTqWxr5U7VJynCZgGcVdG6', '辣鸭美食', 'food', '黄老板', '13900007001', 'huang@laya.com', '凯里酸汤系列、苗家烤鱼、特色小吃', 'active', '2026-06-22 10:00:00', '2026-06-22 09:30:00'),
('merchant_yunyou_guizhou', '$2a$12$LJ3m4ys3Lk0TSwHBQRSMfOBbOdBNJZpNTqWxr5U7VJynCZgGcVdG6', '云游贵州', 'travel', '郑导游', '13900008001', 'zheng@yunyou.com', '贵州全景深度游，涵盖黔东南/黔南/黔西南经典线路', 'suspended', '2026-06-25 16:00:00', '2026-06-25 15:30:00');

-- ============================================
-- 4. 商家入驻申请
-- ============================================
INSERT INTO merchant_application (user_id, shop_name, module, contact_name, contact_phone, contact_email, shop_description, materials, status, reviewer_id, review_comment, reviewed_at, created_at) VALUES
(101, '蜡染艺术馆', 'clothing', '韦老师', '13910001001', 'wei@laran.com', '苗族蜡染技艺传承与创新，手工蜡染服饰及文创产品', '["https://picsum.photos/seed/mat1/800/600.jpg","https://picsum.photos/seed/mat2/800/600.jpg"]', 'pending', NULL, NULL, NULL, '2026-06-26 10:00:00'),
(102, '梯田民宿', 'lodging', '林经理', '13910002001', 'lin@titian.com', '加榜梯田观景民宿，日出云海尽收眼底', '["https://picsum.photos/seed/mat3/800/600.jpg","https://picsum.photos/seed/mat4/800/600.jpg","https://picsum.photos/seed/mat5/800/600.jpg"]', 'pending', NULL, NULL, NULL, '2026-06-26 14:00:00'),
(103, '侗家风味馆', 'food', '石主厨', '13910003001', 'shi@dongjia.com', '侗族特色美食，腌鱼腌肉、油茶、侗果', '["https://picsum.photos/seed/mat6/800/600.jpg"]', 'pending', NULL, NULL, NULL, '2026-06-27 09:00:00'),
(104, '苗疆探秘旅行社', 'travel', '马经理', '13910004001', 'ma@miaojiang.com', '专业苗疆文化旅游线路策划，资深苗族导游团队', '["https://picsum.photos/seed/mat7/800/600.jpg","https://picsum.photos/seed/mat8/800/600.jpg"]', 'approved', 1, '资质齐全，同意入驻', '2026-06-20 11:00:00', '2026-06-19 08:00:00'),
(105, '银匠世家', 'clothing', '李银匠', '13910005001', 'li@yinjiang.com', '家族五代银匠传承，手工银饰定制', '["https://picsum.photos/seed/mat9/800/600.jpg"]', 'approved', 1, '材料完整，符合要求', '2026-06-22 15:00:00', '2026-06-21 10:00:00'),
(106, '黔城驿站', 'lodging', '周老板', '13910006001', 'zhou@qiancheng.com', '贵阳市中心特色民宿，交通便利，苗族风格装修', '["https://picsum.photos/seed/mat10/800/600.jpg"]', 'rejected', 1, '资质不全，缺少卫生许可证', '2026-06-23 09:00:00', '2026-06-22 16:00:00'),
(107, '酸汤故事', 'food', '赵大厨', '13910007001', 'zhao@suantang.com', '以酸汤为核心，讲述苗族饮食文化故事', '["https://picsum.photos/seed/mat11/800/600.jpg","https://picsum.photos/seed/mat12/800/600.jpg"]', 'pending', NULL, NULL, NULL, '2026-06-27 11:30:00');

-- ============================================
-- 5. 订单数据 (最近7天，每个模块每天约5-15单)
-- ============================================
-- 6月21日
INSERT INTO orders (order_no, module, merchant_id, merchant_name, user_id, user_name, amount, commission, status, created_at) VALUES
('WD20260621001','clothing', 1, '苗祖银饰工坊', 1001, '用户A', 580.00, 58.00, 'paid', '2026-06-21 08:30:00'),
('WD20260621002','food', 3, '苗味人家', 1002, '用户B', 128.00, 10.24, 'paid', '2026-06-21 09:15:00'),
('WD20260621003','lodging', 2, '千户苗寨客栈', 1003, '用户C', 680.00, 81.60, 'paid', '2026-06-21 10:00:00'),
('WD20260621004','travel', 4, '山里乐游', 1004, '用户D', 1280.00, 102.40, 'paid', '2026-06-21 11:20:00'),
('WD20260621005','clothing', 5, '苗绣坊', 1005, '用户E', 320.00, 32.00, 'paid', '2026-06-21 14:00:00'),
('WD20260621006','food', 7, '辣鸭美食', 1006, '用户F', 85.00, 6.80, 'paid', '2026-06-21 16:30:00'),
('WD20260621007','lodging', 6, '古镇客栈', 1007, '用户G', 480.00, 57.60, 'paid', '2026-06-21 18:00:00'),
('WD20260621008','travel', 4, '山里乐游', 1008, '用户H', 2580.00, 206.40, 'paid', '2026-06-21 19:30:00'),
('WD20260621009','clothing', 1, '苗祖银饰工坊', 1009, '用户I', 1200.00, 120.00, 'paid', '2026-06-21 20:00:00'),
('WD20260621010','food', 3, '苗味人家', 1010, '用户J', 156.00, 12.48, 'paid', '2026-06-21 20:45:00');

-- 6月22日
INSERT INTO orders (order_no, module, merchant_id, merchant_name, user_id, user_name, amount, commission, status, created_at) VALUES
('WD20260622001','clothing', 1, '苗祖银饰工坊', 1011, '用户K', 780.00, 78.00, 'paid', '2026-06-22 08:00:00'),
('WD20260622002','food', 3, '苗味人家', 1012, '用户L', 198.00, 15.84, 'paid', '2026-06-22 09:30:00'),
('WD20260622003','lodging', 2, '千户苗寨客栈', 1013, '用户M', 580.00, 69.60, 'paid', '2026-06-22 10:30:00'),
('WD20260622004','travel', 4, '山里乐游', 1014, '用户N', 1880.00, 150.40, 'paid', '2026-06-22 11:00:00'),
('WD20260622005','clothing', 5, '苗绣坊', 1015, '用户O', 460.00, 46.00, 'paid', '2026-06-22 13:00:00'),
('WD20260622006','food', 7, '辣鸭美食', 1016, '用户P', 112.00, 8.96, 'paid', '2026-06-22 14:30:00'),
('WD20260622007','lodging', 6, '古镇客栈', 1017, '用户Q', 650.00, 78.00, 'paid', '2026-06-22 16:00:00'),
('WD20260622008','travel', 8, '云游贵州', 1018, '用户R', 3200.00, 256.00, 'paid', '2026-06-22 17:00:00'),
('WD20260622009','clothing', 1, '苗祖银饰工坊', 1019, '用户S', 1500.00, 150.00, 'paid', '2026-06-22 18:30:00'),
('WD20260622010','food', 3, '苗味人家', 1020, '用户T', 95.00, 7.60, 'paid', '2026-06-22 19:00:00'),
('WD20260622011','lodging', 2, '千户苗寨客栈', 1021, '用户U', 750.00, 90.00, 'paid', '2026-06-22 20:00:00'),
('WD20260622012','travel', 4, '山里乐游', 1022, '用户V', 1680.00, 134.40, 'paid', '2026-06-22 21:00:00');

-- 6月23日
INSERT INTO orders (order_no, module, merchant_id, merchant_name, user_id, user_name, amount, commission, status, created_at) VALUES
('WD20260623001','clothing', 5, '苗绣坊', 1023, '用户W', 290.00, 29.00, 'paid', '2026-06-23 08:30:00'),
('WD20260623002','food', 7, '辣鸭美食', 1024, '用户X', 68.00, 5.44, 'paid', '2026-06-23 09:00:00'),
('WD20260623003','lodging', 6, '古镇客栈', 1025, '用户Y', 520.00, 62.40, 'paid', '2026-06-23 10:00:00'),
('WD20260623004','travel', 4, '山里乐游', 1026, '用户Z', 980.00, 78.40, 'paid', '2026-06-23 11:30:00'),
('WD20260623005','clothing', 1, '苗祖银饰工坊', 1027, '用户AA', 890.00, 89.00, 'paid', '2026-06-23 14:00:00'),
('WD20260623006','food', 3, '苗味人家', 1028, '用户BB', 145.00, 11.60, 'paid', '2026-06-23 15:30:00'),
('WD20260623007','lodging', 2, '千户苗寨客栈', 1029, '用户CC', 920.00, 110.40, 'paid', '2026-06-23 16:00:00'),
('WD20260623008','travel', 8, '云游贵州', 1030, '用户DD', 2200.00, 176.00, 'paid', '2026-06-23 18:00:00');

-- 6月24日
INSERT INTO orders (order_no, module, merchant_id, merchant_name, user_id, user_name, amount, commission, status, created_at) VALUES
('WD20260624001','clothing', 1, '苗祖银饰工坊', 1031, '用户EE', 1600.00, 160.00, 'paid', '2026-06-24 08:00:00'),
('WD20260624002','food', 3, '苗味人家', 1032, '用户FF', 210.00, 16.80, 'paid', '2026-06-24 09:30:00'),
('WD20260624003','lodging', 6, '古镇客栈', 1033, '用户GG', 780.00, 93.60, 'paid', '2026-06-24 10:00:00'),
('WD20260624004','travel', 4, '山里乐游', 1034, '用户HH', 3500.00, 280.00, 'paid', '2026-06-24 11:00:00'),
('WD20260624005','clothing', 5, '苗绣坊', 1035, '用户II', 520.00, 52.00, 'paid', '2026-06-24 13:30:00'),
('WD20260624006','food', 7, '辣鸭美食', 1036, '用户JJ', 176.00, 14.08, 'paid', '2026-06-24 14:00:00'),
('WD20260624007','lodging', 2, '千户苗寨客栈', 1037, '用户KK', 880.00, 105.60, 'paid', '2026-06-24 16:30:00'),
('WD20260624008','travel', 4, '山里乐游', 1038, '用户LL', 1980.00, 158.40, 'paid', '2026-06-24 17:00:00'),
('WD20260624009','clothing', 1, '苗祖银饰工坊', 1039, '用户MM', 350.00, 35.00, 'paid', '2026-06-24 18:30:00'),
('WD20260624010','food', 3, '苗味人家', 1040, '用户NN', 132.00, 10.56, 'paid', '2026-06-24 19:00:00'),
('WD20260624011','lodging', 2, '千户苗寨客栈', 1041, '用户OO', 680.00, 81.60, 'refunding', '2026-06-24 20:00:00');

-- 6月25日
INSERT INTO orders (order_no, module, merchant_id, merchant_name, user_id, user_name, amount, commission, status, created_at) VALUES
('WD20260625001','clothing', 5, '苗绣坊', 1042, '用户PP', 180.00, 18.00, 'paid', '2026-06-25 08:30:00'),
('WD20260625002','food', 7, '辣鸭美食', 1043, '用户QQ', 78.00, 6.24, 'paid', '2026-06-25 09:00:00'),
('WD20260625003','lodging', 2, '千户苗寨客栈', 1044, '用户RR', 590.00, 70.80, 'paid', '2026-06-25 10:00:00'),
('WD20260625004','travel', 8, '云游贵州', 1045, '用户SS', 1580.00, 126.40, 'paid', '2026-06-25 11:00:00'),
('WD20260625005','clothing', 1, '苗祖银饰工坊', 1046, '用户TT', 980.00, 98.00, 'paid', '2026-06-25 14:00:00'),
('WD20260625006','food', 3, '苗味人家', 1047, '用户UU', 168.00, 13.44, 'paid', '2026-06-25 15:00:00'),
('WD20260625007','lodging', 6, '古镇客栈', 1048, '用户VV', 430.00, 51.60, 'paid', '2026-06-25 16:30:00'),
('WD20260625008','travel', 4, '山里乐游', 1049, '用户WW', 1200.00, 96.00, 'paid', '2026-06-25 18:00:00'),
('WD20260625009','clothing', 1, '苗祖银饰工坊', 1050, '用户XX', 460.00, 46.00, 'paid', '2026-06-25 19:00:00');

-- 6月26日
INSERT INTO orders (order_no, module, merchant_id, merchant_name, user_id, user_name, amount, commission, status, created_at) VALUES
('WD20260626001','clothing', 1, '苗祖银饰工坊', 1051, '用户YY', 680.00, 68.00, 'paid', '2026-06-26 08:00:00'),
('WD20260626002','food', 3, '苗味人家', 1052, '用户ZZ', 245.00, 19.60, 'paid', '2026-06-26 09:30:00'),
('WD20260626003','lodging', 2, '千户苗寨客栈', 1053, '用户AAA', 880.00, 105.60, 'paid', '2026-06-26 10:00:00'),
('WD20260626004','travel', 4, '山里乐游', 1054, '用户BBB', 2680.00, 214.40, 'paid', '2026-06-26 11:00:00'),
('WD20260626005','clothing', 5, '苗绣坊', 1055, '用户CCC', 380.00, 38.00, 'paid', '2026-06-26 13:00:00'),
('WD20260626006','food', 7, '辣鸭美食', 1056, '用户DDD', 98.00, 7.84, 'paid', '2026-06-26 14:00:00'),
('WD20260626007','lodging', 6, '古镇客栈', 1057, '用户EEE', 720.00, 86.40, 'paid', '2026-06-26 16:00:00'),
('WD20260626008','travel', 8, '云游贵州', 1058, '用户FFF', 1890.00, 151.20, 'paid', '2026-06-26 17:30:00'),
('WD20260626009','clothing', 1, '苗祖银饰工坊', 1059, '用户GGG', 1300.00, 130.00, 'paid', '2026-06-26 18:30:00'),
('WD20260626010','food', 3, '苗味人家', 1060, '用户HHH', 156.00, 12.48, 'paid', '2026-06-26 19:00:00'),
('WD20260626011','lodging', 2, '千户苗寨客栈', 1061, '用户III', 1280.00, 153.60, 'paid', '2026-06-26 20:00:00');

-- 6月27日 (今天)
INSERT INTO orders (order_no, module, merchant_id, merchant_name, user_id, user_name, amount, commission, status, created_at) VALUES
('WD20260627001','clothing', 5, '苗绣坊', 1062, '用户JJJ', 420.00, 42.00, 'paid', '2026-06-27 08:00:00'),
('WD20260627002','food', 7, '辣鸭美食', 1063, '用户KKK', 88.00, 7.04, 'paid', '2026-06-27 09:00:00'),
('WD20260627003','lodging', 6, '古镇客栈', 1064, '用户LLL', 650.00, 78.00, 'paid', '2026-06-27 09:30:00'),
('WD20260627004','travel', 4, '山里乐游', 1065, '用户MMM', 1580.00, 126.40, 'paid', '2026-06-27 10:00:00'),
('WD20260627005','clothing', 1, '苗祖银饰工坊', 1066, '用户NNN', 780.00, 78.00, 'confirmed', '2026-06-27 11:00:00'),
('WD20260627006','food', 3, '苗味人家', 1067, '用户OOO', 125.00, 10.00, 'paid', '2026-06-27 13:00:00'),
('WD20260627007','lodging', 2, '千户苗寨客栈', 1068, '用户PPP', 550.00, 66.00, 'paid', '2026-06-27 14:00:00'),
('WD20260627008','travel', 8, '云游贵州', 1069, '用户QQQ', 2200.00, 176.00, 'paid', '2026-06-27 15:00:00'),
('WD20260627009','clothing', 1, '苗祖银饰工坊', 1070, '用户RRR', 960.00, 96.00, 'pending_pay', '2026-06-27 16:30:00');

-- ============================================
-- 6. 结算数据
-- ============================================
INSERT INTO settlement_record (order_id, merchant_id, merchant_name, order_amount, commission_rate, commission_amount, merchant_income, status, settled_at, created_at) VALUES
(1, 1, '苗祖银饰工坊', 580.00, 10.00, 58.00, 522.00, 'confirmed', '2026-06-21 18:00:00', '2026-06-21 08:30:00'),
(2, 3, '苗味人家', 128.00, 8.00, 10.24, 117.76, 'confirmed', '2026-06-21 18:00:00', '2026-06-21 09:15:00'),
(3, 2, '千户苗寨客栈', 680.00, 12.00, 81.60, 598.40, 'confirmed', '2026-06-21 18:00:00', '2026-06-21 10:00:00'),
(4, 4, '山里乐游', 1280.00, 8.00, 102.40, 1177.60, 'confirmed', '2026-06-21 18:00:00', '2026-06-21 11:20:00'),
(13, 7, '辣鸭美食', 112.00, 8.00, 8.96, 103.04, 'confirmed', '2026-06-24 18:00:00', '2026-06-22 14:30:00'),
(14, 6, '古镇客栈', 650.00, 12.00, 78.00, 572.00, 'pending', NULL, '2026-06-22 16:00:00'),
(15, 8, '云游贵州', 3200.00, 8.00, 256.00, 2944.00, 'pending', NULL, '2026-06-22 17:00:00'),
(23, 6, '古镇客栈', 780.00, 12.00, 93.60, 686.40, 'pending', NULL, '2026-06-24 10:00:00'),
(24, 4, '山里乐游', 3500.00, 8.00, 280.00, 3220.00, 'pending', NULL, '2026-06-24 11:00:00');

INSERT INTO settlement_sheet (merchant_id, merchant_name, period, total_orders, total_amount, total_commission, total_income, status, created_at) VALUES
(1, '苗祖银饰工坊', '2026-06', 12, 10800.00, 1080.00, 9720.00, 'pending', '2026-06-27 08:00:00'),
(2, '千户苗寨客栈', '2026-06', 10, 8600.00, 1032.00, 7568.00, 'pending', '2026-06-27 08:00:00'),
(3, '苗味人家', '2026-06', 8, 1740.00, 139.20, 1600.80, 'pending', '2026-06-27 08:00:00'),
(4, '山里乐游', '2026-06', 10, 17580.00, 1406.40, 16173.60, 'confirmed', '2026-06-27 08:00:00'),
(5, '苗绣坊', '2026-06', 6, 2180.00, 218.00, 1962.00, 'pending', '2026-06-27 08:00:00'),
(6, '古镇客栈', '2026-06', 5, 3700.00, 444.00, 3256.00, 'pending', '2026-06-27 08:00:00'),
(7, '辣鸭美食', '2026-06', 5, 844.00, 67.52, 776.48, 'pending', '2026-06-27 08:00:00'),
(8, '云游贵州', '2026-06', 4, 8870.00, 709.60, 8160.40, 'paid', '2026-06-27 08:00:00');

-- ============================================
-- 7. 系统消息
-- ============================================
INSERT INTO system_message (user_id, type, title, content, is_read, created_at) VALUES
(NULL, 'system', '平台公告：端午节活动上线', '各位商家，端午节特别活动已上线，请及时更新商品和活动信息！', false, '2026-06-20 10:00:00'),
(NULL, 'system', '系统维护通知', '平台将于6月28日凌晨2:00-4:00进行系统升级维护，届时暂停服务', false, '2026-06-25 09:00:00'),
(1, 'notification', '审核通过通知', '恭喜！您的商家入驻申请已通过审核，欢迎加入乌东文旅平台', false, '2026-06-15 10:30:00'),
(2, 'notification', '审核通过通知', '恭喜！您的商家入驻申请已通过审核，欢迎加入乌东文旅平台', false, '2026-06-10 09:00:00'),
(3, 'notification', '审核通过通知', '恭喜！您的商家入驻申请已通过审核，欢迎加入乌东文旅平台', false, '2026-06-08 15:00:00'),
(3, 'order', '新订单提醒', '您有一笔新的美食订单，金额128元', false, '2026-06-21 09:16:00'),
(2, 'order', '新订单提醒', '您有一笔新的住宿订单，金额680元', true, '2026-06-21 10:01:00'),
(4, 'order', '新订单提醒', '您有一笔新的旅游订单，金额1280元', true, '2026-06-21 11:21:00'),
(1, 'refund', '退款申请提醒', '用户AAA申请退款，订单号WD20260625005', false, '2026-06-26 15:00:00');

-- ============================================
-- 8. 首页运营数据
-- ============================================
INSERT INTO banner (title, image_url, link_url, sort_order, status, created_at) VALUES
('西江千户苗寨欢迎您', 'https://picsum.photos/seed/banner1/1920/600', '/travel/routes/1', 1, 'published', '2026-06-01 09:00:00'),
('非遗银饰文化节', 'https://picsum.photos/seed/banner2/1920/600', '/clothing/crafts', 2, 'published', '2026-06-05 10:00:00'),
('端午苗寨民俗体验', 'https://picsum.photos/seed/banner3/1920/600', '/travel/activities/1', 3, 'published', '2026-06-10 08:00:00'),
('苗家酸汤美食季', 'https://picsum.photos/seed/banner4/1920/600', '/food/special', 4, 'draft', '2026-06-15 14:00:00'),
('梯田徒步摄影大赛', 'https://picsum.photos/seed/banner5/1920/600', '/community/events/1', 5, 'published', '2026-06-20 11:00:00');

INSERT INTO announcement (title, content, published_at, status, created_at) VALUES
('关于端午节期间订单处理的通知', '端午节期间（6月25日-6月27日），平台正常运营。请各位商家提前备货，确保订单及时处理。客服服务时间调整为9:00-21:00。', '2026-06-20 09:00:00', 'published', '2026-06-20 09:00:00'),
('平台佣金调整公告', '自2026年7月1日起，服饰类佣金调整为11%，餐饮类调整为8.5%，住宿类调整为13%，出行类维持8%不变。已产生的订单按原佣金比例执行。', '2026-06-22 10:00:00', 'published', '2026-06-22 10:00:00'),
('系统升级维护通知', '平台计划于6月28日凌晨2:00-4:00进行系统升级，届时暂停所有服务。升级完成后将带来更流畅的用户体验，敬请期待。', '2026-06-25 09:00:00', 'published', '2026-06-25 09:00:00'),
('商家入驻审核时效说明', '近期入驻申请量增加，审核时间可能延长至5个工作日。我们将加派人手处理，感谢您的耐心等待。', '2026-06-26 15:00:00', 'draft', '2026-06-26 15:00:00');

INSERT INTO activity_banner (title, image_url, link_url, start_time, end_time, status, created_at) VALUES
('苗族银饰文化体验周', 'https://picsum.photos/seed/act1/800/400', '/activities/silver', '2026-07-01 00:00:00', '2026-07-07 23:59:59', 'published', '2026-06-20 10:00:00'),
('千户苗寨篝火晚会', 'https://picsum.photos/seed/act2/800/400', '/activities/bonfire', '2026-07-15 19:00:00', '2026-07-15 22:00:00', 'published', '2026-06-22 14:00:00'),
('暑期亲子苗寨游学营', 'https://picsum.photos/seed/act3/800/400', '/activities/study-tour', '2026-07-10 00:00:00', '2026-08-20 23:59:59', 'published', '2026-06-25 09:00:00');

INSERT INTO recommendation_slot (slot_name, content_type, content_id, sort_order, status, created_at) VALUES
('首页热门推荐-银饰', 'product', 101, 1, 'published', '2026-06-10 10:00:00'),
('首页热门推荐-民宿', 'product', 201, 2, 'published', '2026-06-10 10:30:00'),
('首页热门推荐-美食', 'product', 301, 3, 'published', '2026-06-12 09:00:00'),
('首页热门推荐-线路', 'product', 401, 4, 'published', '2026-06-15 14:00:00'),
('精选游记-1', 'travelogue', 501, 5, 'published', '2026-06-18 16:00:00'),
('精选游记-2', 'travelogue', 502, 6, 'published', '2026-06-20 11:00:00');

-- ============================================
-- 9. 操作日志
-- ============================================
INSERT INTO admin_operation_log (operator_id, operator_name, action_type, target_type, target_id, action_detail, ip, created_at) VALUES
(1, '超级管理员', 'login', 'admin', 1, '管理员登录系统', '127.0.0.1', '2026-06-27 08:00:00'),
(1, '超级管理员', 'audit_approve', 'merchant_application', 4, '审核通过商家入驻申请：苗疆探秘旅行社', '127.0.0.1', '2026-06-20 11:05:00'),
(1, '超级管理员', 'audit_approve', 'merchant_application', 5, '审核通过商家入驻申请：银匠世家', '127.0.0.1', '2026-06-22 15:10:00'),
(1, '超级管理员', 'audit_reject', 'merchant_application', 6, '驳回商家入驻申请：黔城驿站，原因：资质不全', '127.0.0.1', '2026-06-23 09:05:00'),
(1, '超级管理员', 'create_banner', 'banner', 1, '创建轮播图：西江千户苗寨欢迎您', '127.0.0.1', '2026-06-01 09:05:00'),
(1, '超级管理员', 'create_announcement', 'announcement', 1, '发布公告：关于端午节期间订单处理的通知', '127.0.0.1', '2026-06-20 09:05:00'),
(1, '超级管理员', 'update_commission', 'platform_commission_config', 1, '修改服饰类抽佣比例：10% -> 11%', '127.0.0.1', '2026-06-22 10:05:00'),
(1, '超级管理员', 'generate_settlement', 'settlement_sheet', 0, '生成2026年6月份商家结算单（8个商家）', '127.0.0.1', '2026-06-27 08:05:00'),
(1, '超级管理员', 'send_message', 'system_message', 1, '群发平台公告：端午节活动上线', '127.0.0.1', '2026-06-20 10:05:00'),
(1, '超级管理员', 'ban_user', 'admin_user', 0, '禁用违规用户', '127.0.0.1', '2026-06-25 16:00:00');

-- ============================================
-- 10. 系统配置
-- ============================================
INSERT INTO system_config (config_key, config_value, description) VALUES
('payment_methods', '["wechat","alipay"]', '支持的支付方式'),
('sms_provider', 'aliyun', '短信服务商'),
('default_page_size', '20', '默认分页大小'),
('refund_deadline_days', '7', '退款申请期限（天）'),
('order_timeout_minutes', '30', '订单超时取消时间（分钟）');

-- ============================================
-- 11. 运费模板
-- ============================================
INSERT INTO shipping_template (name, default_fee, free_threshold, region_rules, status, created_at) VALUES
('全国包邮', 0.00, 0.00, NULL, 'published', '2026-06-01 09:00:00'),
('满99包邮', 10.00, 99.00, NULL, 'published', '2026-06-01 09:00:00'),
('偏远地区加收', 15.00, 199.00, '{"xinjiang":25,"xizang":25,"neimenggu":20}', 'published', '2026-06-10 14:00:00');
