import React from 'react';
import { Navigate } from 'react-router-dom';
import { Spin } from 'antd';
import { useAuth } from '../../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  role?: 'admin' | 'merchant';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, role }) => {
  const { loading, isAuthenticated, user } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <Spin size="large" tip="加载中..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 角色校验：roleId=1 是管理员，其他是商家
  if (role && user) {
    const isAdmin = user.roleId === 1 || user.roleName === 'admin' || user.roleName === '超级管理员';
    const hasAccess = role === 'admin' ? isAdmin : !isAdmin;
    if (!hasAccess) {
      return (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            flexDirection: 'column',
          }}
        >
          <h2>403 - 无访问权限</h2>
          <p>您没有权限访问此页面</p>
        </div>
      );
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
