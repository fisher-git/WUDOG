import React, { useState } from 'react';
import { Card, Form, Input, Select, Button, Typography, message, Space, Radio, Divider } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import { sendMessage } from '../../../services/message';
import type { SendMessageRequest } from '@wudong/shared';
import { MessageType } from '@wudong/shared';

const { Title } = Typography;
const { TextArea } = Input;

const MessageSend: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [targetType, setTargetType] = useState<'all' | 'specific'>('all');

  const handleSend = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      const payload: SendMessageRequest = {
        type: values.type,
        title: values.title,
        content: values.content,
        sendAll: targetType === 'all',
        userIds: targetType === 'specific' && values.userIds ? values.userIds : undefined,
      };
      await sendMessage(payload);
      message.success('消息已发送');
      form.resetFields(['title', 'content']);
    } catch { } finally { setLoading(false); }
  };

  return (
    <Card title="发送消息">
      <Form form={form} layout="vertical" style={{ maxWidth: 600 }}>
        <Form.Item name="type" label="消息类型" initialValue={MessageType.SYSTEM}
          rules={[{ required: true, message: '请选择消息类型' }]}>
          <Select options={[
            { label: '系统通知', value: MessageType.SYSTEM },
            { label: '订单消息', value: MessageType.ORDER },
            { label: '退款消息', value: MessageType.REFUND },
            { label: '活动通知', value: MessageType.NOTIFICATION },
          ]} />
        </Form.Item>

        <Form.Item name="title" label="消息标题" rules={[{ required: true, message: '请输入消息标题' }]}>
          <Input placeholder="请输入消息标题" maxLength={100} showCount />
        </Form.Item>

        <Form.Item name="content" label="消息内容" rules={[{ required: true, message: '请输入消息内容' }]}>
          <TextArea rows={6} placeholder="请输入消息内容，支持纯文本..." maxLength={2000} showCount />
        </Form.Item>

        <Divider>发送目标</Divider>

        <Radio.Group value={targetType} onChange={(e) => setTargetType(e.target.value)}
          style={{ marginBottom: 16 }}>
          <Radio.Button value="all">全部用户</Radio.Button>
          <Radio.Button value="specific">指定用户</Radio.Button>
        </Radio.Group>

        {targetType === 'specific' && (
          <Form.Item name="userIds" label="目标用户ID"
            rules={[{ required: targetType === 'specific', message: '请输入用户ID' }]}>
            <Select mode="tags" placeholder="输入用户ID后回车添加，可添加多个"
              tokenSeparators={[',']} style={{ width: '100%' }} />
          </Form.Item>
        )}

        <Form.Item>
          <Button type="primary" icon={<SendOutlined />} onClick={handleSend}
            loading={loading} size="large">
            {targetType === 'all' ? '发送给全部用户' : '发送消息'}
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default MessageSend;
