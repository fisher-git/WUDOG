import React, { useState } from 'react';
import { Form, Input, Button, Card, message, Typography, Checkbox } from 'antd';
import { PhoneOutlined, LockOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const startCountdown = () => {
    setCountdown(60);
    const timer = setInterval(() => setCountdown((prev) => { if (prev <= 1) { clearInterval(timer); return 0; } return prev - 1; }), 1000);
  };

  const sendSms = async () => {
    message.success('验证码已发送 (开发环境使用123456)');
    startCountdown();
  };

  const onFinish = async (values: any) => {
    if (values.password !== values.confirmPassword) { message.error('两次密码输入不一致'); return; }
    setLoading(true);
    try {
      const res: any = await api.post('/public/auth/register', values);
      if (res?.code === 200) {
        login(res.data.token, res.data.userInfo);
        message.success('注册成功');
        navigate('/');
      } else {
        message.error(res?.message || '注册失败');
      }
    } catch {
      message.error('注册失败，请重试');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', padding: 24 }}>
      <Card style={{ width: 420, borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Typography.Title level={2} style={{ color: '#1B3A5C', marginBottom: 8 }}>创建账号</Typography.Title>
          <Typography.Text type="secondary">注册乌东文旅账号</Typography.Text>
        </div>
        <Form onFinish={onFinish} size="large">
          <Form.Item name="phone" rules={[{ required: true, message: '请输入手机号' }, { pattern: /^1\d{10}$/, message: '手机号格式不正确' }]}>
            <Input prefix={<PhoneOutlined />} placeholder="手机号" />
          </Form.Item>
          <Form.Item>
            <Input.Search prefix={<SafetyCertificateOutlined />} placeholder="短信验证码" enterButton={countdown > 0 ? `${countdown}s` : '发送验证码'} onSearch={sendSms} loading={false} disabled={countdown > 0} name="smsCode" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: '请设置密码' }, { min: 6, message: '密码至少6位' }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="设置密码" />
          </Form.Item>
          <Form.Item name="confirmPassword" rules={[{ required: true, message: '请确认密码' }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="确认密码" />
          </Form.Item>
          <Form.Item name="agreement" valuePropName="checked" rules={[{ validator: (_, v) => v ? Promise.resolve() : Promise.reject('请阅读并同意用户协议') }]}>
            <Checkbox>我已阅读并同意 <a href="#">《用户协议》</a> 和 <a href="#">《隐私政策》</a></Checkbox>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading} style={{ height: 44, fontSize: 16 }}>注册</Button>
          </Form.Item>
        </Form>
        <div style={{ textAlign: 'center', color: '#999' }}>已有账号？<Link to="/login">立即登录</Link></div>
      </Card>
    </div>
  );
};

export default RegisterPage;
