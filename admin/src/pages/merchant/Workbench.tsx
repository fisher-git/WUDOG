import React, { useEffect, useState } from 'react';
import {
  Row, Col, Card, Statistic, Table, Tag, Typography, Spin,
} from 'antd';
import {
  ShoppingCartOutlined, InboxOutlined, DollarOutlined, WarningOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import api from '../../services/api';
import dayjs from 'dayjs';

const { Title } = Typography;

interface RecentOrder {
  id: number;
  orderNo: string;
  amount: number;
  status: string;
  userName: string;
  createdAt: string;
}

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

const Workbench: React.FC = () => {
  const [stats, setStats] = useState({ todayOrders: 0, pendingShip: 0, pendingRefund: 0, todayRevenue: 0 });
  const [orders, setOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.get('/merchant/workbench')
      .then((res) => {
        const d = res.data;
        setStats(d?.stats || { todayOrders: 0, pendingShip: 0, pendingRefund: 0, todayRevenue: 0 });
        setOrders(d?.recentOrders || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const columns: ColumnsType<RecentOrder> = [
    { title: '订单号', dataIndex: 'orderNo', width: 180, ellipsis: true },
    { title: '用户', dataIndex: 'userName', width: 100 },
    { title: '金额', dataIndex: 'amount', width: 100, render: (v: number) => <span style={{ fontWeight: 500 }}>¥{v.toFixed(2)}</span> },
    { title: '状态', dataIndex: 'status', width: 90, render: (s: string) => {
      const cfg = statusMap[s] || { color: 'default', label: s };
      return <Tag color={cfg.color}>{cfg.label}</Tag>;
    }},
    { title: '下单时间', dataIndex: 'createdAt', width: 170, render: (v: string) => dayjs(v).format('YYYY-MM-DD HH:mm') },
  ];

  return (
    <Spin spinning={loading}>
      <Title level={4} style={{ marginBottom: 24 }}>工作台</Title>
      <Row gutter={[16, 16]}>
        <Col xs={12} sm={6}>
          <Card className="stat-card" bordered={false}>
            <Statistic title="今日订单" value={stats.todayOrders} prefix={<ShoppingCartOutlined />} />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className="stat-card" bordered={false}>
            <Statistic title="待发货" value={stats.pendingShip} prefix={<InboxOutlined />} valueStyle={{ color: '#faad14' }} />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className="stat-card" bordered={false}>
            <Statistic title="待退款" value={stats.pendingRefund} prefix={<WarningOutlined />} valueStyle={{ color: '#ff4d4f' }} />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className="stat-card" bordered={false} style={{ borderLeft: '3px solid #C8A45C' }}>
            <Statistic title="今日营业额" value={stats.todayRevenue} prefix={<DollarOutlined />} precision={2} suffix="元" />
          </Card>
        </Col>
      </Row>

      <Card title="最近订单" style={{ marginTop: 16 }}>
        <Table rowKey="id" columns={columns} dataSource={orders}
          pagination={{ pageSize: 5, showTotal: (t) => `共 ${t} 条` }}
          scroll={{ x: 700 }} size="small" />
      </Card>
    </Spin>
  );
};

export default Workbench;
