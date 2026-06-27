import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Descriptions, Button, Spin, Tag, Typography } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { getOrderDetail, type OrderDetailInfo } from '../../../services/order';
import { ModuleType } from '@wudong/shared';
import dayjs from 'dayjs';

const { Title } = Typography;

const moduleMap: Record<string, string> = {
  [ModuleType.CLOTHING]: '非遗商品', [ModuleType.FOOD]: '餐饮美食',
  [ModuleType.LODGING]: '民宿住宿', [ModuleType.TRAVEL]: '出行旅游',
};

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

const OrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [detail, setDetail] = useState<OrderDetailInfo | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getOrderDetail(Number(id))
      .then((res) => setDetail(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <Spin spinning={loading}>
      <Button type="link" icon={<ArrowLeftOutlined />} onClick={() => navigate('/admin/orders')}
        style={{ marginBottom: 16, padding: 0 }}>返回列表</Button>

      {!loading && !detail && (
        <Card><Typography.Text type="secondary">订单不存在或已被删除</Typography.Text></Card>
      )}

      {detail && (
        <Card title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Title level={4} style={{ margin: 0 }}>订单详情</Title>
            <Tag color={statusMap[detail.status]?.color}>
              {statusMap[detail.status]?.label}
            </Tag>
          </div>
        }>
          <Descriptions bordered column={2} size="small">
            <Descriptions.Item label="订单编号">{detail.orderNo}</Descriptions.Item>
            <Descriptions.Item label="订单模块">
              <Tag>{moduleMap[detail.module] || detail.module}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="商家名称">{detail.merchantName || '-'}</Descriptions.Item>
            <Descriptions.Item label="用户名称">{detail.userName || '-'}</Descriptions.Item>
            <Descriptions.Item label="订单金额">
              <span style={{ fontWeight: 600, color: '#cf1322', fontSize: 16 }}>
                ¥{Number(detail.amount).toFixed(2)}
              </span>
            </Descriptions.Item>
            <Descriptions.Item label="佣金">
              ¥{Number((detail as any).commission || 0).toFixed(2)}
            </Descriptions.Item>
            <Descriptions.Item label="下单时间">
              {dayjs(detail.createdAt).format('YYYY-MM-DD HH:mm:ss')}
            </Descriptions.Item>
            <Descriptions.Item label="更新时间">
              {detail.updatedAt ? dayjs(detail.updatedAt).format('YYYY-MM-DD HH:mm:ss') : '-'}
            </Descriptions.Item>
            <Descriptions.Item label="支付时间">
              {detail.paidAt ? dayjs(detail.paidAt).format('YYYY-MM-DD HH:mm:ss') : '-'}
            </Descriptions.Item>
            <Descriptions.Item label="发货时间">
              {detail.shippedAt ? dayjs(detail.shippedAt).format('YYYY-MM-DD HH:mm:ss') : '-'}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      )}
    </Spin>
  );
};

export default OrderDetail;
