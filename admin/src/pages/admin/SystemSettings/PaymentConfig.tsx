import React, { useEffect, useState } from 'react';
import { Card, Form, Input, Button, message, Spin } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { getPaymentConfig, setPaymentConfig } from '../../../services/system';

const PaymentConfig: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    getPaymentConfig()
      .then((res) => {
        form.setFieldsValue(res.data.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSaving(true);
      await setPaymentConfig(values);
      message.success('支付配置已保存');
    } catch { } finally { setSaving(false); }
  };

  return (
    <Spin spinning={loading}>
      <Card title="微信支付配置" extra={
        <Button type="primary" icon={<SaveOutlined />} onClick={handleSubmit} loading={saving}>保存</Button>
      }>
        <Form form={form} layout="vertical" style={{ maxWidth: 560 }}>
          <Form.Item name="merchantId" label="商户号 (MCH ID)"
            rules={[{ required: true, message: '请输入商户号' }]}>
            <Input placeholder="请输入微信支付商户号" maxLength={50} />
          </Form.Item>
          <Form.Item name="apiKey" label="API 密钥"
            rules={[{ required: true, message: '请输入API密钥' }]}>
            <Input.Password placeholder="请输入API密钥" maxLength={64} />
          </Form.Item>
          <Form.Item name="notifyUrl" label="支付回调 URL"
            rules={[{ required: true, message: '请输入回调URL' }, { type: 'url', message: '请输入有效的URL' }]}>
            <Input placeholder="https://api.wudong.com/api/payment/callback" />
          </Form.Item>
        </Form>
      </Card>
    </Spin>
  );
};

export default PaymentConfig;
