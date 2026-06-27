import React from 'react';
import { Card, Row, Col, Tag } from 'antd';

const crafts = [
  { id: 1, name: '苗族银饰', desc: '国家级非遗', image: '/images/craft1.jpg', tag: '银饰锻造' },
  { id: 2, name: '苗族蜡染', desc: '千年传统技艺', image: '/images/craft2.jpg', tag: '蜡染技艺' },
  { id: 3, name: '苗绣', desc: '指尖上的艺术', image: '/images/craft3.jpg', tag: '刺绣工艺' },
];

const SelectedCrafts: React.FC = () => (
  <div className="section-container">
    <h2 className="section-title">精选非遗</h2>
    <p className="section-subtitle">苗族手工艺人的匠心之作，每一件都是文化的传承</p>
    <Row gutter={[24, 24]}>
      {crafts.map((c) => (
        <Col xs={24} md={8} key={c.id}>
          <Card hoverable cover={<div style={{ height: 360, background: `url(${c.image}) center/cover`, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(transparent 50%, rgba(0,0,0,0.7))', transition: '0.3s' }} className="craft-overlay" />
            <Tag color="#C8A45C" style={{ position: 'absolute', top: 16, left: 16, fontSize: 13 }}>{c.tag}</Tag>
            <div style={{ position: 'absolute', bottom: 24, left: 24, color: '#fff' }}>
              <h3 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>{c.name}</h3>
              <p style={{ margin: '4px 0 0', opacity: 0.9 }}>{c.desc}</p>
            </div>
          </div>} bodyStyle={{ display: 'none' }} />
        </Col>
      ))}
    </Row>
  </div>
);

export default SelectedCrafts;
