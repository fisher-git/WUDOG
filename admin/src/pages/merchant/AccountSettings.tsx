import React, { useState } from 'react';
import {
  Card, Form, Input, Button, message, Tabs, Divider,
} from 'antd';
import { SaveOutlined, LockOutlined, MobileOutlined } from '@ant-design/icons';
import api from '../../services/api';

const AccountSettings: React.FC = () => {
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [phoneLoading, setPhoneLoading] = useState(false);
  const [passwordForm] = Form.useForm();
  const [phoneForm] = Form.useForm();

  const handleChangePassword = async () => {
    try {
      const values = await passwordForm.validateFields();
      setPasswordLoading(true);
      await api.put('/merchant/account/password', values);
      message.success('密码修改成功，请重新登录');
      passwordForm.resetFields();
    } catch { } finally { setPasswordLoading(false); }
  };

  const handleBindPhone = async () => {
    try {
      const values = await phoneForm.validateFields();
      setPhoneLoading(true);
      await api.put('/merchant/account/phone', values);
      message.success('手机号绑定成功');
      phoneForm.resetFields();
    } catch { } finally { setPhoneLoading(false); }
  };

  const tabItems = [
    {
      key: 'password',
      label: (
        <span><LockOutlined /> 修改密码</span>
      ),
      children: (
        <Form form={passwordForm} layout="vertical" style={{ maxWidth: 480 }}>
          <Form.Item name="oldPassword" label="原密码"
            rules={[{ required: true, message: '请输入原密码' }]}>
            <Input.Password placeholder="请输入原密码" />
          </Form.Item>
          <Form.Item name="newPassword" label="新密码"
            rules={[
              { required: true, message: '请输入新密码' },
              { min: 6, message: '密码至少6位' },
            ]}>
            <Input.Password placeholder="请输入新密码（至少6位）" />
          </Form.Item>
          <Form.Item name="confirmPassword" label="确认新密码" dependencies={['newPassword']}
            rules={[
              { required: true, message: '请确认新密码' },
              ({ getFieldValue }) => ({
                validator: (_, value) =>
                  value === getFieldValue('newPassword')
                    ? Promise.resolve()
                    : Promise.reject(new Error('两次输入的密码不一致')),
              }),
            ]}>
            <Input.Password placeholder="请再次输入新密码" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" icon={<SaveOutlined />} onClick={handleChangePassword}
              loading={passwordLoading} size="large">修改密码</Button>
          </Form.Item>
        </Form>
      ),
    },
    {
      key: 'phone',
      label: (
        <span><MobileOutlined /> 绑定手机</span>
      ),
      children: (
        <Form form={phoneForm} layout="vertical" style={{ maxWidth: 480 }}>
          <Form.Item name="phone" label="手机号"
            rules={[
              { required: true, message: '请输入手机号' },
              { pattern: /^1\d{10}$/, message: '请输入有效的11位手机号' },
            ]}>
            <Input placeholder="请输入手机号" maxLength={11} />
          </Form.Item>
          <Form.Item name="smsCode" label="验证码"
            rules={[{ required: true, message: '请输入验证码' }]}>
            <Input placeholder="请输入短信验证码" maxLength={6}
              suffix={
                <Button type="link" size="small" style={{ padding: 0 }}>
                  获取验证码
                </Button>
              } />
          </Form.Item>
          <Form.Item>
            <Button type="primary" icon={<SaveOutlined />} onClick={handleBindPhone}
              loading={phoneLoading} size="large">绑定手机</Button>
          </Form.Item>
        </Form>
      ),
    },
  ];

  return (
    <Card title="账号设置">
      <Tabs defaultActiveKey="password" items={tabItems} />
    </Card>
  );
};

export default AccountSettings;
