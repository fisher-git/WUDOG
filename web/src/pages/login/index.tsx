import React from 'react';
import { Form, Input, Button, Card, message, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = React.useState(false);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const res: any = await api.post('/public/auth/login', values);
      if (res?.code === 200) {
        login(res.data.token, res.data.userInfo);
        message.success('登录成功');
        navigate('/');
      } else {
        message.error(res?.message || '登录失败');
      }
    } catch {
      message.error('登录失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', padding: 24 }}>
      <Card style={{ width: 420, borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Typography.Title level={2} style={{ color: '#1B3A5C', marginBottom: 8 }}>🏔 乌东文旅</Typography.Title>
          <Typography.Text type="secondary">登录您的账号</Typography.Text>
        </div>
        <Form onFinish={onFinish} size="large">
          <Form.Item name="phone" rules={[{ required: true, message: '请输入手机号' }, { pattern: /^1\d{10}$/, message: '手机号格式不正确' }]}>
            <Input prefix={<UserOutlined />} placeholder="手机号" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="密码" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading} style={{ height: 44, fontSize: 16 }}>登录</Button>
          </Form.Item>
        </Form>
        <div style={{ textAlign: 'center', color: '#999' }}>
          还没有账号？<Link to="/register">立即注册</Link>
          <span style={{ margin: '0 8px' }}>|</span>
          <Link to="/forgot-password">忘记密码？</Link>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
