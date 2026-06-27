import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Form, Input, Button, Typography } from 'antd';
import { UserOutlined, LockOutlined, SafetyOutlined, ReloadOutlined } from '@ant-design/icons';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';

const { Title, Text } = Typography;

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [captchaSvg, setCaptchaSvg] = useState('');
  const [captchaId, setCaptchaId] = useState('');

  useEffect(() => {
    if (isAuthenticated) navigate('/admin/dashboard', { replace: true });
  }, [isAuthenticated, navigate]);

  const fetchCaptcha = useCallback(async () => {
    try {
      const res: any = await api.get('/admin/auth/captcha');
      const d = res?.data || res;
      setCaptchaSvg(d?.svg || '');
      setCaptchaId(d?.captchaId || '');
    } catch { /* ignore */ }
  }, []);

  useEffect(() => { fetchCaptcha(); }, [fetchCaptcha]);

  const handleLogin = async (values: any) => {
    setLoading(true);
    try {
      const ok = await login(values.username, values.password, undefined, captchaId, values.captchaCode);
      if (ok) navigate('/admin/dashboard', { replace: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #1B3A5C 0%, #2A5A8C 50%, #1B3A5C 100%)' }}>
      <Card style={{ width: 420, borderRadius: 16, boxShadow: '0 8px 40px rgba(0,0,0,0.2)' }}>
        <div style={{ textAlign: 'center', padding: '16px 0' }}>
          <div style={{ width: 56, height: 56, margin: '0 auto 8px', background: 'linear-gradient(135deg, #1B3A5C, #C8A45C)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#fff', fontSize: 24, fontWeight: 'bold' }}>乌</span>
          </div>
          <Title level={3} style={{ color: '#1B3A5C', margin: 0 }}>乌东文旅管理后台</Title>
        </div>

        <Form form={form} layout="vertical" onFinish={handleLogin} autoComplete="off" initialValues={{ username: 'admin', password: 'admin123' }}>
          <Form.Item name="username" rules={[{ required: true, message: '请输入用户名' }]}>
            <Input prefix={<UserOutlined />} placeholder="用户名" size="large" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="密码" size="large" />
          </Form.Item>

          <div style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <div
                dangerouslySetInnerHTML={{ __html: captchaSvg }}
                style={{ cursor: 'pointer', borderRadius: 4, border: '1px solid #d9d9d9', lineHeight: 0, flex: 'none' }}
                onClick={fetchCaptcha}
              />
              <Button type="link" size="small" icon={<ReloadOutlined />} onClick={fetchCaptcha}>换一张</Button>
            </div>
          </div>

          <Form.Item name="captchaCode" rules={[{ required: true, message: '请输入验证码' }]}>
            <Input prefix={<SafetyOutlined />} placeholder="验证码（4位）" size="large" maxLength={4}
              style={{ textTransform: 'uppercase', letterSpacing: 4, fontWeight: 'bold' }} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" block loading={loading}
              style={{ background: '#1B3A5C', borderColor: '#1B3A5C', height: 44 }}>
              登录
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center', color: '#999', fontSize: 12 }}>
            演示账号 admin / admin123，点击验证码图片可刷新
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;
