import React, { useEffect, useState } from 'react';
import {
  Card, Form, Input, Button, Upload, message, Spin, Typography,
} from 'antd';
import { UploadOutlined, SaveOutlined } from '@ant-design/icons';
import api from '../../services/api';

const { Title } = Typography;
const { TextArea } = Input;

interface StoreFormData {
  shopName: string;
  logo: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  shopDescription: string;
}

const StoreInfo: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [logoUrl, setLogoUrl] = useState('');

  useEffect(() => {
    api.get('/merchant/store')
      .then((res) => {
        const d = res.data;
        form.setFieldsValue(d);
        setLogoUrl(d?.logo || '');
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [form]);

  const handleSubmit = async () => {
    try {
      const values: StoreFormData = await form.validateFields();
      setSaving(true);
      await api.put('/merchant/store', { ...values, logo: logoUrl || values.logo });
      message.success('店铺信息已保存');
    } catch { } finally { setSaving(false); }
  };

  return (
    <Spin spinning={loading}>
      <Card title="店铺信息" extra={
        <Button type="primary" icon={<SaveOutlined />} onClick={handleSubmit} loading={saving}>保存</Button>
      }>
        <Form form={form} layout="vertical" style={{ maxWidth: 640 }} preserve={false}>
          <Form.Item name="shopName" label="店铺名称" rules={[{ required: true, message: '请输入店铺名称' }]}>
            <Input placeholder="请输入店铺名称" maxLength={50} />
          </Form.Item>
          <Form.Item label="店铺 Logo">
            <Input
              placeholder="输入Logo图片URL"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              style={{ marginBottom: 8 }}
            />
            <Upload showUploadList={false}
              customRequest={({ onSuccess }) => { if (onSuccess) onSuccess({}); message.info('模拟上传'); }}>
              <Button icon={<UploadOutlined />}>本地上传</Button>
            </Upload>
            {logoUrl && (
              <img src={logoUrl} alt="Logo预览" style={{ marginTop: 8, maxHeight: 80, borderRadius: 4 }} />
            )}
          </Form.Item>
          <Form.Item name="contactName" label="联系人" rules={[{ required: true, message: '请输入联系人' }]}>
            <Input placeholder="请输入联系人" maxLength={30} />
          </Form.Item>
          <Form.Item name="contactPhone" label="联系电话"
            rules={[
              { required: true, message: '请输入联系电话' },
              { pattern: /^1\d{10}$/, message: '请输入有效手机号' },
            ]}>
            <Input placeholder="请输入联系电话" maxLength={11} />
          </Form.Item>
          <Form.Item name="contactEmail" label="联系邮箱"
            rules={[{ type: 'email', message: '请输入有效邮箱' }]}>
            <Input placeholder="请输入联系邮箱" maxLength={50} />
          </Form.Item>
          <Form.Item name="shopDescription" label="店铺描述">
            <TextArea rows={4} placeholder="请输入店铺描述..." maxLength={500} showCount />
          </Form.Item>
        </Form>
      </Card>
    </Spin>
  );
};

export default StoreInfo;
