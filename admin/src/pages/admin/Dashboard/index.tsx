import React, { useEffect, useState, useCallback } from 'react';
import { Row, Col, Card, Statistic, Select, Spin, Typography, Table, Tag } from 'antd';
import {
  UserOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  TeamOutlined,
  ShopOutlined,
  AccountBookOutlined,
  TrophyOutlined,
} from '@ant-design/icons';
import LineChart from '../../../components/charts/LineChart';
import BarChart from '../../../components/charts/BarChart';
import PieChart from '../../../components/charts/PieChart';
import { getOverview, type DashboardOverview } from '../../../services/dashboard';

const { Title, Text } = Typography;

const DashboardPage: React.FC = () => {
  const [data, setData] = useState<DashboardOverview | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getOverview();
      setData(res.data);
    } catch {
      // error handled by interceptor
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // 准备图表数据 — 适配后端返回格式
  // 后端 orderTrend: [{ date, clothing, food, lodging, travel }, ...]
  const orderTrendX = data?.orderTrend?.map((item) => item.date) || [];
  const orderTrendSeries = data?.orderTrend
    ? ['clothing', 'food', 'lodging', 'travel'].map((mod) => ({
        name: { clothing: '非遗商品', food: '餐饮美食', lodging: '民宿住宿', travel: '出行旅游' }[mod] || mod,
        data: data.orderTrend.map((item: any) => Number(item[mod]) || 0),
      }))
    : [];

  const userGrowthX = data?.userGrowth?.map((item) => item.date) || [];
  const userGrowthSeries = data?.userGrowth
    ? [{ name: '新增用户', data: data.userGrowth.map((item) => item.count) }]
    : [];

  const contentData = (data?.contentStats || []).map((item) => ({ name: item.type, value: item.count }));

  // Top merchants columns
  const topMerchantColumns = [
    { title: '商家', dataIndex: 'shopName', key: 'shopName', width: 140 },
    {
      title: '模块', dataIndex: 'module', key: 'module', width: 80,
      render: (m: string) => {
        const map: Record<string, { color: string; label: string }> = {
          clothing: { color: 'blue', label: '服饰' },
          food: { color: 'orange', label: '美食' },
          lodging: { color: 'purple', label: '住宿' },
          travel: { color: 'green', label: '出行' },
        };
        const cfg = map[m] || { color: 'default', label: m };
        return <Tag color={cfg.color}>{cfg.label}</Tag>;
      },
    },
    {
      title: '订单数', dataIndex: 'orderCount', key: 'orderCount', width: 80,
    },
    {
      title: '销售额', dataIndex: 'totalAmount', key: 'totalAmount', width: 120,
      render: (v: number) => `¥${v.toLocaleString()}`,
    },
  ];

  return (
    <Spin spinning={loading}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={4} style={{ margin: 0 }}>数据概览</Title>
        <Text type="secondary" style={{ fontSize: 13 }}>
          数据来源：MySQL 实时查询 | 更新时间：刚刚
        </Text>
      </div>

      {/* 第一行统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card">
            <Statistic
              title="日活用户 (DAU)"
              value={data?.dau || 0}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card">
            <Statistic
              title="今日新增用户"
              value={data?.newUsers || 0}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card">
            <Statistic
              title="今日订单数"
              value={data?.orderCount || 0}
              prefix={<ShoppingCartOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card" style={{ borderLeft: '3px solid #C8A45C' }}>
            <Statistic
              title="今日 GMV (元)"
              value={data?.gmv || 0}
              precision={2}
              prefix={<DollarOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* 第二行统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card className="stat-card">
            <Statistic
              title="用户总数"
              value={data?.totalUsers || 0}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className="stat-card">
            <Statistic
              title="商家总数"
              value={data?.totalMerchants || 0}
              suffix={
                <span style={{ fontSize: 13, color: '#8c8c8c' }}>
                  / 活跃 {data?.activeMerchants || 0}
                </span>
              }
              prefix={<ShopOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className="stat-card" style={{ borderLeft: '3px solid #1B3A5C' }}>
            <Statistic
              title="平台总营收 (元)"
              value={data?.financeStats?.totalRevenue || 0}
              precision={2}
              prefix={<AccountBookOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* 图表行 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} lg={12}>
          <Card title="各模块订单趋势 (近7日)">
            <LineChart
              xData={orderTrendX}
              series={orderTrendSeries}
              height={360}
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="用户增长趋势 (近7日)">
            <BarChart
              xData={userGrowthX}
              series={userGrowthSeries}
              height={360}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={8}>
          <Card title="内容统计">
            <PieChart
              data={contentData}
              height={320}
              radius="65%"
            />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card
            title={<span><TrophyOutlined style={{ marginRight: 8, color: '#C8A45C' }} />TOP 商家排行</span>}
          >
            <Table
              dataSource={data?.merchantStats?.top || []}
              columns={topMerchantColumns}
              rowKey="id"
              size="small"
              pagination={false}
              scroll={{ x: 420 }}
            />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title={<span><AccountBookOutlined style={{ marginRight: 8 }} />财务概览</span>}>
            <Row gutter={[0, 16]}>
              <Col span={24}>
                <Statistic
                  title="平台收入（佣金）"
                  value={data?.financeStats?.platformIncome || 0}
                  precision={2}
                  prefix="¥"
                  valueStyle={{ color: '#3f8600', fontSize: 24 }}
                />
              </Col>
              <Col span={24}>
                <Statistic
                  title="待结算金额"
                  value={data?.financeStats?.pendingSettlement || 0}
                  precision={2}
                  prefix="¥"
                  valueStyle={{ color: '#cf1322', fontSize: 20 }}
                />
              </Col>
              <Col span={24}>
                <div style={{ fontSize: 13, color: '#8c8c8c' }}>
                  总营收 ¥{(data?.financeStats?.totalRevenue || 0).toLocaleString()} |
                  佣金率约 {data?.financeStats?.totalRevenue
                    ? ((data.financeStats.platformIncome / data.financeStats.totalRevenue) * 100).toFixed(1)
                    : 0}%
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </Spin>
  );
};

export default DashboardPage;
