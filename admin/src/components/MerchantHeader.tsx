import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, Badge, Avatar, Dropdown, Space, Typography, theme } from 'antd';
import {
  BellOutlined,
  UserOutlined,
  LogoutOutlined,
  KeyOutlined,
  ShopOutlined,
} from '@ant-design/icons';
import { useAuth } from '../hooks/useAuth';

const { Header } = Layout;
const { Text } = Typography;

const MerchantHeader: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { token: themeToken } = theme.useToken();

  const handleLogout = async () => {
    await logout();
  };

  const dropdownItems = {
    items: [
      {
        key: 'store',
        icon: <ShopOutlined />,
        label: '店铺信息',
        onClick: () => navigate('/merchant/store'),
      },
      {
        key: 'password',
        icon: <KeyOutlined />,
        label: '修改密码',
        onClick: () => navigate('/merchant/account'),
      },
      { type: 'divider' as const },
      {
        key: 'logout',
        icon: <LogoutOutlined />,
        label: '退出登录',
        onClick: handleLogout,
      },
    ],
  };

  return (
    <Header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 24px',
        background: themeToken.colorBgContainer,
      }}
    >
      <Space size={24}>
        <Badge count={3} size="small">
          <BellOutlined
            style={{ fontSize: 18, cursor: 'pointer' }}
            onClick={() => navigate('/merchant/messages')}
          />
        </Badge>
        <Dropdown menu={dropdownItems} placement="bottomRight">
          <Space style={{ cursor: 'pointer' }}>
            <Avatar size="small" icon={<UserOutlined />} style={{ backgroundColor: '#C8A45C' }} />
            <Text>{user?.name || user?.username || '商家用户'}</Text>
          </Space>
        </Dropdown>
      </Space>
    </Header>
  );
};

export default MerchantHeader;
