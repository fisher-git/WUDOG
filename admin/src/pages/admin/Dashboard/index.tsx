import React, { useEffect, useState, useCallback } from 'react';
import { Row, Col, Card, Statistic, Select, Spin, Typography } from 'antd';
import {
  RiseOutlined,
  FallOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import LineChart from '../../../components/charts/LineChart';
import BarChart from '../../../components/charts/BarChart';
import PieChart from '../../../components/charts/PieChart';
import FunnelChart from '../../../components/charts/FunnelChart';
import { getOverview, type DashboardOverview } from '../../../services/dashboard';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';

const { Title } = Typography;

const rangeOptions = [
  { label: '近7天', value: 'week' },
  { label: '近30天', value: 'month' },
  { label: '近90天', value: 'quarter' },
  { label: '近1年', value: 'year' },
];

const DashboardPage: React.FC = () => {
  const [data, setData] = useState<DashboardOverview | null>(null);
  const [loading, setLoading] = useState(false);
  const [range, setRange] = useState('week');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getOverview(range);
      setData(res.data.data);
    } catch {
      // error handled by interceptor
    } finally {
      setLoading(false);
    }
  }, [range]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // 准备图表数据
  const orderTrendX = data?.orderTrend
    ? [...new Set(data.orderTrend.map((item) => item.date))]
    : [];
  const orderTrendSeries = React.useMemo(() => {
    if (!data?.orderTrend) return [];
    const moduleMap = new Map<string, number[]>();
    data.orderTrend.forEach((item) => {
      if (!moduleMap.has(item.module)) moduleMap.set(item.module, []);
      moduleMap.get(item.module)!.push(item.count);
    });
    // 补充数组长度
    moduleMap.forEach((arr, key) => {
      while (arr.length < orderTrendX.length) arr.push(0);
    });
    return Array.from(moduleMap.entries()).map(([name, d]) => ({ name, data: d }));
  }, [data, orderTrendX]);

  const userGrowthX = data?.userGrowth?.map((item) => item.date.slice(5)) || [];
  const userGrowthSeries = data?.userGrowth
    ? [{ name: '新增用户', data: data.userGrowth.map((item) => item.count) }]
    : [];

  const contentData = data?.contentStats || [];
  const funnelData = data?.funnelData || [];

  const changeColor = (val: number) => {
    if (val === 0) return '#8c8c8c';
    return val > 0 ? '#52c41a' : '#ff4d4f';
  };
  const changeIcon = (val: number) => {
    if (val === 0) return null;
    return val > 0 ? <RiseOutlined /> : <FallOutlined />;
  };

  return (
    <Spin spinning={loading}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={4} style={{ margin: 0 }}>数据概览</Title>
        <Select
          value={range}
          onChange={setRange}
          options={rangeOptions}
          style={{ width: 120 }}
        />
      </div>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card" bordered={false}>
            <Statistic
              title="日活用户 (DAU)"
              value={data?.dau || 0}
              prefix={<TeamOutlined />}
              suffix={
                data?.dauChange ? (
                  <span style={{ fontSize: 14, color: changeColor(data.dauChange) }}>
                    {changeIcon(data.dauChange)}
                    {data.dauChange > 0 ? '+' : ''}{data.dauChange}%
                  </span>
                ) : null
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card" bordered={false}>
            <Statistic
              title="新增用户"
              value={data?.newUsers || 0}
              prefix={<UserOutlined />}
              suffix={
                data?.newUsersChange ? (
                  <span style={{ fontSize: 14, color: changeColor(data.newUsersChange) }}>
                    {changeIcon(data.newUsersChange)}
                    {data.newUsersChange > 0 ? '+' : ''}{data.newUsersChange}%
                  </span>
                ) : null
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card" bordered={false}>
            <Statistic
              title="订单数"
              value={data?.totalOrders || 0}
              prefix={<ShoppingCartOutlined />}
              suffix={
                data?.ordersChange ? (
                  <span style={{ fontSize: 14, color: changeColor(data.ordersChange) }}>
                    {changeIcon(data.ordersChange)}
                    {data.ordersChange > 0 ? '+' : ''}{data.ordersChange}%
                  </span>
                ) : null
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card" bordered={false} style={{ borderLeft: '3px solid #C8A45C' }}>
            <Statistic
              title="GMV (元)"
              value={data?.gmv || 0}
              precision={2}
              prefix={<DollarOutlined />}
              suffix={
                data?.gmvChange ? (
                  <span style={{ fontSize: 14, color: changeColor(data.gmvChange) }}>
                    {changeIcon(data.gmvChange)}
                    {data.gmvChange > 0 ? '+' : ''}{data.gmvChange}%
                  </span>
                ) : null
              }
            />
          </Card>
        </Col>
      </Row>

      {/* 图表行 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} lg={12}>
          <Card bordered={false}>
            <LineChart
              title="各模块订单趋势"
              xData={orderTrendX}
              series={orderTrendSeries}
              height={360}
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card bordered={false}>
            <BarChart
              title="用户增长趋势"
              xData={userGrowthX}
              series={userGrowthSeries}
              height={360}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card bordered={false}>
            <PieChart
              title="内容分类统计"
              data={contentData}
              height={360}
              radius="65%"
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card bordered={false}>
            <FunnelChart
              title="GMV 漏斗分析"
              data={funnelData}
              height={360}
            />
          </Card>
        </Col>
      </Row>
    </Spin>
  );
};

export default DashboardPage;
