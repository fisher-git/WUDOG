import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu } from 'antd';
import {
  AppstoreOutlined,
  ShoppingCartOutlined,
  ShopOutlined,
  BarChartOutlined,
  MessageOutlined,
  UserOutlined,
} from '@ant-design/icons';

const menuItems = [
  { key: '/merchant/workbench', label: '工作台', icon: <AppstoreOutlined /> },
  { key: '/merchant/orders', label: '订单管理', icon: <ShoppingCartOutlined /> },
  { key: '/merchant/store', label: '店铺信息', icon: <ShopOutlined /> },
  { key: '/merchant/stats', label: '数据统计', icon: <BarChartOutlined /> },
  { key: '/merchant/messages', label: '消息通知', icon: <MessageOutlined /> },
  { key: '/merchant/account', label: '账号设置', icon: <UserOutlined /> },
];

const MerchantSidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const selectedKey = React.useMemo(() => {
    const path = location.pathname;
    const match = menuItems
      .map((item) => item.key)
      .sort((a, b) => b.length - a.length)
      .find((key) => path.startsWith(key));
    return match || '/merchant/workbench';
  }, [location.pathname]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div
        style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <span style={{ color: '#C8A45C', fontSize: 18, fontWeight: 'bold' }}>商家中心</span>
      </div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[selectedKey]}
        onClick={(info) => navigate(info.key)}
        items={menuItems}
        style={{ borderRight: 0, flex: 1 }}
      />
    </div>
  );
};

export default MerchantSidebar;
