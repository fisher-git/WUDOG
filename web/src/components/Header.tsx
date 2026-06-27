import React, { useState, useEffect } from 'react';
import { Layout, Menu, Input, Button, Space, Dropdown, Avatar, Badge } from 'antd';
import { SearchOutlined, UserOutlined, BellOutlined, ShopOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navItems = [
    { key: '/', label: '首页' },
    { key: '/clothing', label: '衣' },
    { key: '/food', label: '食' },
    { key: '/lodging', label: '住' },
    { key: '/travel', label: '行' },
    { key: '/community', label: '社区' },
  ];

  const userMenu = {
    items: [
      { key: 'profile', label: '个人中心', onClick: () => navigate('/mine') },
      { key: 'orders', label: '我的订单', onClick: () => navigate('/orders') },
      { type: 'divider' as const },
      { key: 'logout', label: '退出登录', onClick: () => { logout(); navigate('/'); } },
    ],
  };

  return (
    <Layout.Header style={{
      position: 'fixed', top: 0, width: '100%', zIndex: 1000,
      background: scrolled ? 'rgba(27,58,92,0.95)' : 'rgba(27,58,92,0.85)',
      backdropFilter: 'blur(10px)', boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.15)' : 'none',
      display: 'flex', alignItems: 'center', padding: '0 24px', height: 64,
      transition: 'all 0.3s',
    }}>
      <div style={{ fontSize: 24, fontWeight: 'bold', color: '#C8A45C', marginRight: 40, cursor: 'pointer', whiteSpace: 'nowrap' }} onClick={() => navigate('/')}>
        🏔 乌东文旅
      </div>

      <Menu mode="horizontal" selectedKeys={[location.pathname]} items={navItems}
        style={{ flex: 1, background: 'transparent', borderBottom: 'none', minWidth: 0 }}
        theme="dark"
        onClick={({ key }) => navigate(key)}
      />

      <Space size={12} style={{ marginLeft: 16 }}>
        <Input prefix={<SearchOutlined />} placeholder="搜索..." style={{ width: 180, borderRadius: 20 }} onPressEnter={(e: any) => navigate(`/search?q=${e.target.value}`)} />
        {isLoggedIn ? (
          <Space size={8}>
            <Badge count={3} size="small"><BellOutlined style={{ fontSize: 20, color: '#fff', cursor: 'pointer' }} /></Badge>
            <Dropdown menu={userMenu}><Avatar icon={<UserOutlined />} style={{ backgroundColor: '#C8A45C', cursor: 'pointer' }} /></Dropdown>
          </Space>
        ) : (
          <Space size={8}>
            <Button type="text" style={{ color: '#fff' }} onClick={() => navigate('/login')}>登录</Button>
            <Button type="primary" ghost onClick={() => navigate('/register')}>注册</Button>
            <Button type="link" icon={<ShopOutlined />} style={{ color: '#C8A45C' }} onClick={() => navigate('/merchant-apply')}>商家入驻</Button>
          </Space>
        )}
      </Space>
    </Layout.Header>
  );
};

export default Header;
