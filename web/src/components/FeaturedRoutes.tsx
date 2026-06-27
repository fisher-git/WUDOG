import React from 'react';
import { Card, Row, Col, Tag, Typography } from 'antd';
import { EnvironmentOutlined, ClockCircleOutlined } from '@ant-design/icons';

interface RouteItem { id: number; title: string; image: string; days: number; price: number; location: string; }

const mockRoutes: RouteItem[] = [
  { id: 1, title: '乌东苗寨一日游', image: '/images/route1.jpg', days: 1, price: 198, location: '乌东村' },
  { id: 2, title: '苗寨梯田深度两日游', image: '/images/route2.jpg', days: 2, price: 498, location: '乌东村+梯田' },
  { id: 3, title: '非遗体验一日游', image: '/images/route3.jpg', days: 1, price: 268, location: '银饰坊+蜡染坊' },
  { id: 4, title: '苗寨+西江千户苗寨两日', image: '/images/route4.jpg', days: 2, price: 798, location: '乌东+西江' },
];

const FeaturedRoutes: React.FC = () => (
  <div className="section-container" style={{ background: '#fff' }}>
    <h2 className="section-title">热门路线</h2>
    <p className="section-subtitle">精选苗寨经典线路，体验最纯正的苗族风情</p>
    <Row gutter={[24, 24]}>
      {mockRoutes.map((r) => (
        <Col xs={24} sm={12} md={6} key={r.id}>
          <Card hoverable cover={<div style={{ height: 200, background: `url(${r.image}) center/cover`, position: 'relative' }}>
            <Tag color="#C8A45C" style={{ position: 'absolute', top: 12, right: 12 }}>{r.days}天</Tag>
          </div>} bodyStyle={{ padding: 16 }}>
            <Typography.Title level={5} ellipsis style={{ marginBottom: 8 }}>{r.title}</Typography.Title>
            <div style={{ color: '#666', marginBottom: 8 }}><EnvironmentOutlined /> {r.location} <ClockCircleOutlined style={{ marginLeft: 12 }} /> {r.days}天{r.days > 1 ? '1' : ''}晚</div>
            <Typography.Text strong style={{ color: '#C8A45C', fontSize: 22 }}>¥{r.price}<span style={{ fontSize: 14, color: '#999' }}>/人起</span></Typography.Text>
          </Card>
        </Col>
      ))}
    </Row>
  </div>
);

export default FeaturedRoutes;
