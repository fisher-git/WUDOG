import React, { useEffect, useState, useCallback } from 'react';
import {
  Card, List, Tag, Typography, Space, Button, Empty, Select, Row, Col, message,
} from 'antd';
import { ReloadOutlined, CheckOutlined } from '@ant-design/icons';
import api from '../../services/api';
import dayjs from 'dayjs';

const { Text, Paragraph } = Typography;

interface MerchantMessage {
  id: number;
  type: string;
  title: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}

const typeMap: Record<string, { color: string; label: string }> = {
  system: { color: 'blue', label: '系统' },
  order: { color: 'green', label: '订单' },
  refund: { color: 'orange', label: '退款' },
  notification: { color: 'cyan', label: '通知' },
};

const Messages: React.FC = () => {
  const [data, setData] = useState<MerchantMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState('');
  const [page, setPage] = useState(1);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/merchant/messages', {
        params: { page, pageSize: 20, type: type || undefined },
      });
      setData(res.data?.list || []);
    } catch { } finally { setLoading(false); }
  }, [page, type]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleMarkAllRead = async () => {
    try {
      await api.put('/merchant/messages/read-all');
      message.success('已全部标记为已读');
      fetchData();
    } catch { }
  };

  return (
    <Card
      title="消息通知"
      extra={
        <Space>
          <Button icon={<ReloadOutlined />} onClick={fetchData}>刷新</Button>
          <Button icon={<CheckOutlined />} onClick={handleMarkAllRead}>全部已读</Button>
        </Space>
      }
    >
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={8} md={6}>
          <Select placeholder="消息类型" value={type || undefined}
            onChange={(v) => { setType(v || ''); setPage(1); }}
            style={{ width: '100%' }} allowClear
            options={Object.entries(typeMap).map(([k, v]) => ({ label: v.label, value: k }))} />
        </Col>
      </Row>
      <List
        loading={loading}
        dataSource={data}
        locale={{ emptyText: <Empty description="暂无消息" /> }}
        pagination={{ pageSize: 10, onChange: setPage }}
        renderItem={(item) => (
          <List.Item
            key={item.id}
            style={{ background: item.isRead ? 'transparent' : '#f0f5ff', padding: '12px 16px', borderRadius: 8, marginBottom: 4 }}
            extra={
              <Space direction="vertical" align="end">
                <Tag color={typeMap[item.type]?.color || 'default'}>
                  {typeMap[item.type]?.label || item.type}
                </Tag>
                <Tag color={item.isRead ? 'default' : 'red'}>{item.isRead ? '已读' : '未读'}</Tag>
              </Space>
            }
          >
            <List.Item.Meta
              title={<Text strong={!item.isRead}>{item.title}</Text>}
              description={
                <>
                  <Paragraph ellipsis={{ rows: 2 }} style={{ margin: 0 }}>{item.content}</Paragraph>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {dayjs(item.createdAt).format('YYYY-MM-DD HH:mm:ss')}
                  </Text>
                </>
              }
            />
          </List.Item>
        )}
      />
    </Card>
  );
};

export default Messages;
