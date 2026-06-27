import React, { useEffect, useState } from 'react';
import { Card, Form, Input, Button, Select, message, Spin } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { getSmsConfig, setSmsConfig } from '../../../services/system';

const SmsConfig: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    getSmsConfig()
      .then((res) => form.setFieldsValue(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSaving(true);
      await setSmsConfig(values);
      message.success('短信配置已保存');
    } catch { } finally { setSaving(false); }
  };

  return (
    <Spin spinning={loading}>
      <Card title="短信服务配置" extra={
        <Button type="primary" icon={<SaveOutlined />} onClick={handleSubmit} loading={saving}>保存</Button>
      }>
        <Form form={form} layout="vertical" style={{ maxWidth: 560 }}>
          <Form.Item name="provider" label="短信服务商"
            rules={[{ required: true, message: '请选择服务商' }]}>
            <Select options={[
              { label: '阿里云短信', value: 'aliyun' },
              { label: '腾讯云短信', value: 'tencent' },
            ]} />
          </Form.Item>
          <Form.Item name="accessKeyId" label="AccessKey ID"
            rules={[{ required: true, message: '请输入AccessKey ID' }]}>
            <Input placeholder="AccessKey ID" maxLength={100} />
          </Form.Item>
          <Form.Item name="accessKeySecret" label="AccessKey Secret"
            rules={[{ required: true, message: '请输入AccessKey Secret' }]}>
            <Input.Password placeholder="AccessKey Secret" maxLength={100} />
          </Form.Item>
          <Form.Item name="signName" label="短信签名"
            rules={[{ required: true, message: '请输入短信签名' }]}>
            <Input placeholder="短信签名（如：乌东文旅）" maxLength={20} />
          </Form.Item>
          <Form.Item name="templateCode" label="模板编码"
            rules={[{ required: true, message: '请输入模板编码' }]}>
            <Input placeholder="SMS_XXXXXXXXX" maxLength={50} />
          </Form.Item>
        </Form>
      </Card>
    </Spin>
  );
};

export default SmsConfig;
