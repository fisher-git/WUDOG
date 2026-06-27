import React, { useEffect, useState } from 'react';
import {
  Row, Col, Card, Statistic, DatePicker, Select, Typography, Spin,
} from 'antd';
import { DollarOutlined, ShoppingCartOutlined, StarOutlined, EyeOutlined } from '@ant-design/icons';
import LineChart from '../../components/charts/LineChart';
import BarChart from '../../components/charts/BarChart';
import api from '../../services/api';
import dayjs from 'dayjs';

const { Title } = Typography;
const { RangePicker } = DatePicker;

interface StatsData {
  totalSales: number;
  totalOrders: number;
  goodRate: number;
  pageViews: number;
  salesTrend: Array<{ date: string; amount: number }>;
  orderStats: Array<{ status: string; count: number }>;
}

const DataStats: React.FC = () => {
  const [data, setData] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [range, setRange] = useState('week');

  useEffect(() => {
    setLoading(true);
    api.get('/merchant/stats', { params: { range } })
      .then((res) => setData(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [range]);

  const salesX = data?.salesTrend?.map((item) => item.date.slice(5)) || [];
  const salesSeries = data?.salesTrend ? [
    { name: '销售额', data: data.salesTrend.map((item) => item.amount) },
  ] : [];

  const orderBarX = data?.orderStats?.map((item) => item.status) || [];
  const orderBarSeries = data?.orderStats ? [
    { name: '订单数', data: data.orderStats.map((item) => item.count) },
  ] : [];

  return (
    <Spin spinning={loading}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={4} style={{ margin: 0 }}>数据统计</Title>
        <Select value={range} onChange={setRange} style={{ width: 120 }}
          options={[
            { label: '近7天', value: 'week' }, { label: '近30天', value: 'month' },
            { label: '近90天', value: 'quarter' },
          ]} />
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={12} sm={6}>
          <Card className="stat-card" bordered={false}>
            <Statistic title="总销售额" value={data?.totalSales || 0} prefix={<DollarOutlined />} precision={2} suffix="元" />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className="stat-card" bordered={false}>
            <Statistic title="总订单" value={data?.totalOrders || 0} prefix={<ShoppingCartOutlined />} />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className="stat-card" bordered={false}>
            <Statistic title="好评率" value={data?.goodRate || 0} prefix={<StarOutlined />} precision={1} suffix="%" />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className="stat-card" bordered={false}>
            <Statistic title="浏览量" value={data?.pageViews || 0} prefix={<EyeOutlined />} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card bordered={false}>
            <LineChart title="销售趋势" xData={salesX} series={salesSeries} height={360} />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card bordered={false}>
            <BarChart title="订单状态分布" xData={orderBarX} series={orderBarSeries} height={360} />
          </Card>
        </Col>
      </Row>
    </Spin>
  );
};

export default DataStats;
