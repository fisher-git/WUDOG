import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card, Descriptions, Timeline, Button, Spin, Tag, Table, Typography, Divider,
} from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { getOrderDetail, type OrderDetailInfo } from '../../../services/order';
import dayjs from 'dayjs';

const { Title } = Typography;

const statusMap: Record<string, { color: string; label: string }> = {
  pending_pay: { color: 'orange', label: '待支付' },
  paid: { color: 'blue', label: '已支付' },
  confirmed: { color: 'cyan', label: '已确认' },
  shipped: { color: 'purple', label: '已发货' },
  received: { color: 'green', label: '已收货' },
  refunding: { color: 'red', label: '退款中' },
  refunded: { color: 'default', label: '已退款' },
  cancelled: { color: 'default', label: '已取消' },
};

const timelineColorMap: Record<string, string> = {
  pending_pay: 'orange', paid: 'blue', confirmed: 'cyan',
  shipped: 'purple', received: 'green', refunding: 'red',
  refunded: 'gray', cancelled: 'gray',
};

const OrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [detail, setDetail] = useState<OrderDetailInfo | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getOrderDetail(Number(id))
      .then((res) => setDetail(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const itemColumns: ColumnsType<OrderDetailInfo['items'][0]> = [
    { title: '商品名称', dataIndex: 'productName', width: 200 },
    { title: '单价', dataIndex: 'price', width: 100, render: (v: number) => `¥${v.toFixed(2)}` },
    { title: '数量', dataIndex: 'quantity', width: 80 },
    { title: '小计', key: 'subtotal', width: 100,
      render: (_, record) => `¥${(record.price * record.quantity).toFixed(2)}` },
  ];

  return (
    <Spin spinning={loading}>
      <Button type="link" icon={<ArrowLeftOutlined />} onClick={() => navigate('/admin/orders')}
        style={{ marginBottom: 16, padding: 0 }}>返回列表</Button>

      {detail && (
        <>
          <Card title={
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Title level={4} style={{ margin: 0 }}>订单详情</Title>
              <Tag color={statusMap[detail.status]?.color}>
                {statusMap[detail.status]?.label}
              </Tag>
            </div>
          }>
            <Descriptions bordered column={3} size="small">
              <Descriptions.Item label="订单号">{detail.orderNo}</Descriptions.Item>
              <Descriptions.Item label="模块">{detail.module}</Descriptions.Item>
              <Descriptions.Item label="商家">{detail.merchantName}</Descriptions.Item>
              <Descriptions.Item label="用户">{detail.userName}</Descriptions.Item>
              <Descriptions.Item label="订单金额">¥{detail.amount.toFixed(2)}</Descriptions.Item>
              <Descriptions.Item label="下单时间">
                {dayjs(detail.createdAt).format('YYYY-MM-DD HH:mm:ss')}
              </Descriptions.Item>
              <Descriptions.Item label="支付时间">
                {detail.paidAt ? dayjs(detail.paidAt).format('YYYY-MM-DD HH:mm:ss') : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="发货时间">
                {detail.shippedAt ? dayjs(detail.shippedAt).format('YYYY-MM-DD HH:mm:ss') : '-'}
              </Descriptions.Item>
            </Descriptions>

            {detail.address && (
              <>
                <Divider orientation="left">收货地址</Divider>
                <Descriptions column={2} size="small">
                  <Descriptions.Item label="收货人">{detail.address.name}</Descriptions.Item>
                  <Descriptions.Item label="电话">
                    {detail.address.phone?.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')}
                  </Descriptions.Item>
                  <Descriptions.Item label="地址" span={2}>
                    {detail.address.province}{detail.address.city}{detail.address.district}{detail.address.detail}
                  </Descriptions.Item>
                </Descriptions>
              </>
            )}

            <Divider orientation="left">商品明细</Divider>
            <Table rowKey="productName" columns={itemColumns} dataSource={detail.items || []}
              pagination={false} size="small" style={{ marginBottom: 16 }}
              summary={() => (
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0} colSpan={3} align="right">
                    <strong>合计：</strong>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={3}>
                    <strong>¥{detail.amount.toFixed(2)}</strong>
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              )} />
          </Card>

          <Card title="操作时间线" style={{ marginTop: 16 }}>
            <Timeline
              items={detail.timeline?.map((t) => ({
                color: timelineColorMap[t.status] || 'gray',
                children: (
                  <div>
                    <strong>{t.label}</strong>
                    <div style={{ color: '#8c8c8c', fontSize: 12 }}>
                      {dayjs(t.time).format('YYYY-MM-DD HH:mm:ss')} · {t.operator}
                    </div>
                  </div>
                ),
              })) || []}
            />
          </Card>
        </>
      )}
    </Spin>
  );
};

export default OrderDetail;
