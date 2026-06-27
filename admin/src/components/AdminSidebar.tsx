import React, { useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  AuditOutlined,
  HomeOutlined,
  MessageOutlined,
  DollarOutlined,
  ShoppingCartOutlined,
  SettingOutlined,
  FileTextOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons';
import { usePermission } from '../hooks/usePermission';

interface MenuItem {
  key: string;
  label: string;
  icon: React.ReactNode;
  permission?: string;
  children?: MenuItem[];
}

const allMenuItems: MenuItem[] = [
  { key: '/admin/dashboard', label: '数据概览', icon: <DashboardOutlined />, permission: 'dashboard:view' },
  { key: '/admin/users', label: '用户管理', icon: <UserOutlined />, permission: 'users:view' },
  { key: '/admin/audit', label: '入驻审核', icon: <AuditOutlined />, permission: 'audit:view' },
  { key: '/admin/homepage', label: '首页运营', icon: <HomeOutlined />, permission: 'homepage:view' },
  { key: '/admin/messages', label: '消息中心', icon: <MessageOutlined />, permission: 'messages:view' },
  { key: '/admin/finance', label: '财务管理', icon: <DollarOutlined />, permission: 'finance:view' },
  { key: '/admin/orders', label: '全局订单', icon: <ShoppingCartOutlined />, permission: 'orders:view' },
  { key: '/admin/system', label: '系统设置', icon: <SettingOutlined />, permission: 'system:view' },
  { key: '/admin/roles', label: '角色权限', icon: <SafetyCertificateOutlined />, permission: 'roles:view' },
  { key: '/admin/logs', label: '操作日志', icon: <FileTextOutlined />, permission: 'logs:view' },
];

function filterMenuByPermission(items: MenuItem[], can: (code: string) => boolean): MenuItem[] {
  return items
    .filter((item) => {
      if (item.permission) {
        return can(item.permission);
      }
      return true;
    })
    .map((item) => ({
      ...item,
      children: item.children ? filterMenuByPermission(item.children, can) : undefined,
    }))
    .filter((item) => {
      if (item.children) {
        return item.children.length > 0;
      }
      return true;
    });
}

const AdminSidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { can } = usePermission();

  const menuItems = useMemo(() => filterMenuByPermission(allMenuItems, can), [can]);

  const selectedKey = useMemo(() => {
    const path = location.pathname;
    // 精确匹配或父路径匹配
    const match = menuItems
      .map((item) => item.key)
      .sort((a, b) => b.length - a.length)
      .find((key) => path.startsWith(key));
    return match || '/admin/dashboard';
  }, [location.pathname, menuItems]);

  const handleClick = (info: { key: string }) => {
    navigate(info.key);
  };

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
        <span style={{ color: '#C8A45C', fontSize: 20, fontWeight: 'bold', letterSpacing: 2 }}>
          乌东文旅
        </span>
      </div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[selectedKey]}
        onClick={handleClick}
        items={menuItems}
        style={{ borderRight: 0, flex: 1, overflow: 'auto' }}
      />
    </div>
  );
};

export default AdminSidebar;
