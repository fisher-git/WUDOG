import React, { useState } from 'react';
import { Form, Input, Button, Card, message, Select, Result, Upload, Typography, Checkbox } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { submitMerchantApplication } from '../../services/home';

const MerchantApplyPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const res: any = await submitMerchantApplication(values);
      if (res?.code === 200) { setSubmitted(true); } else { message.error(res?.message || '提交失败'); }
    } catch { message.error('提交失败，请重试'); }
    finally { setLoading(false); }
  };

  if (submitted) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
        <Result status="success" title="申请已提交" subTitle="您的商家入驻申请已成功提交，预计1-3个工作日完成审核，请耐心等待。" extra={[<Button type="primary" key="home" onClick={() => window.location.href = '/'}>返回首页</Button>]} />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '48px 24px' }}>
      <Card style={{ maxWidth: 640, width: '100%', borderRadius: 16 }}>
        <Typography.Title level={3} style={{ textAlign: 'center', color: '#1B3A5C', marginBottom: 8 }}>商家入驻申请</Typography.Title>
        <Typography.Paragraph type="secondary" style={{ textAlign: 'center', marginBottom: 32 }}>填写以下信息，成为乌东文旅的合作伙伴</Typography.Paragraph>
        <Form layout="vertical" onFinish={onFinish} size="large">
          <Form.Item name="shopName" label="店铺名称" rules={[{ required: true, message: '请输入店铺名称' }]}>
            <Input placeholder="请输入您的店铺名称" />
          </Form.Item>
          <Form.Item name="module" label="经营类目" rules={[{ required: true, message: '请选择经营类目' }]}>
            <Select placeholder="请选择经营类目" options={[{ value: 'clothing', label: '非遗手工坊（衣）' }, { value: 'food', label: '特色餐厅/农产品（食）' }, { value: 'lodging', label: '民宿客栈（住）' }, { value: 'travel', label: '景区/线路运营商（行）' }]} />
          </Form.Item>
          <Form.Item name="contactName" label="联系人" rules={[{ required: true }]}><Input placeholder="联系人姓名" /></Form.Item>
          <Form.Item name="contactPhone" label="联系电话" rules={[{ required: true }, { pattern: /^1\d{10}$/, message: '手机号格式不正确' }]}><Input placeholder="联系电话" /></Form.Item>
          <Form.Item name="contactEmail" label="联系邮箱"><Input placeholder="联系邮箱（选填）" /></Form.Item>
          <Form.Item name="shopDescription" label="店铺描述"><Input.TextArea rows={4} placeholder="请描述您的店铺特色、产品/服务等" /></Form.Item>
          <Form.Item name="materials" label="资质材料">
            <Upload.Dragger multiple maxCount={5} beforeUpload={() => false} accept="image/*,.pdf">
              <p className="ant-upload-drag-icon"><InboxOutlined /></p>
              <p>点击或拖拽文件上传</p>
              <p style={{ color: '#999', fontSize: 12 }}>支持图片和PDF，最多5个文件</p>
            </Upload.Dragger>
          </Form.Item>
          <Form.Item name="agreement" valuePropName="checked" rules={[{ validator: (_, v) => v ? Promise.resolve() : Promise.reject('请阅读并同意') }]}>
            <Checkbox>我已阅读并同意 <a href="#">《商家入驻协议》</a></Checkbox>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading} style={{ height: 48, fontSize: 16 }}>提交申请</Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default MerchantApplyPage;
