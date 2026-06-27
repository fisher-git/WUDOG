import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, Badge, Avatar, Dropdown, Space, Typography, theme } from 'antd';
import {
  BellOutlined,
  UserOutlined,
  LogoutOutlined,
  KeyOutlined,
} from '@ant-design/icons';
import { useAuth } from '../hooks/useAuth';

const { Header } = Layout;
const { Text } = Typography;

const AdminHeader: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { token: themeToken } = theme.useToken();

  const handleLogout = async () => {
    await logout();
  };

  const dropdownItems = {
    items: [
      {
        key: 'profile',
        icon: <UserOutlined />,
        label: '个人信息',
      },
      {
        key: 'password',
        icon: <KeyOutlined />,
        label: '修改密码',
        onClick: () => navigate('/admin/system'),
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
        <Badge count={5} size="small">
          <BellOutlined
            style={{ fontSize: 18, cursor: 'pointer' }}
            onClick={() => navigate('/admin/messages')}
          />
        </Badge>
        <Dropdown menu={dropdownItems} placement="bottomRight">
          <Space style={{ cursor: 'pointer' }}>
            <Avatar size="small" icon={<UserOutlined />} style={{ backgroundColor: '#1B3A5C' }} />
            <Text>{user?.name || user?.username || '管理员'}</Text>
          </Space>
        </Dropdown>
      </Space>
    </Header>
  );
};

export default AdminHeader;
