import React from 'react';
import { Card, Row, Col, Rate, Tag } from 'antd';

const foods = [
  { id: 1, name: '苗家长桌宴', image: '/images/food1.jpg', rating: 4.8, tags: ['特色宴席', '非遗'], price: 88 },
  { id: 2, name: '酸汤鱼', image: '/images/food2.jpg', rating: 4.6, tags: ['招牌菜', '酸辣'], price: 68 },
  { id: 3, name: '苗家腊肉', image: '/images/food3.jpg', rating: 4.7, tags: ['特产', '烟熏'], price: 58 },
  { id: 4, name: '糯米酒', image: '/images/food4.jpg', rating: 4.5, tags: ['特产', '手工'], price: 38 },
];

const FoodRecommendations: React.FC = () => (
  <div className="section-container" style={{ background: '#fff' }}>
    <h2 className="section-title">美食推荐</h2>
    <p className="section-subtitle">品味苗家地道美食，感受舌尖上的苗族文化</p>
    <Row gutter={[24, 24]}>
      {foods.map((f) => (
        <Col xs={12} sm={6} key={f.id}>
          <Card hoverable cover={<div style={{ height: 180, background: `url(${f.image}) center/cover` }} />} bodyStyle={{ padding: 16 }}>
            <h4 style={{ marginBottom: 8 }}>{f.name}</h4>
            <Rate disabled defaultValue={f.rating} style={{ fontSize: 12, marginBottom: 8 }} />
            <div style={{ marginBottom: 8 }}>{f.tags.map(t => <Tag key={t} color="gold" style={{ fontSize: 11 }}>{t}</Tag>)}</div>
            <span style={{ color: '#C8A45C', fontSize: 20, fontWeight: 700 }}>¥{f.price}<span style={{ fontSize: 13, color: '#999', fontWeight: 400 }}>/人起</span></span>
          </Card>
        </Col>
      ))}
    </Row>
  </div>
);

export default FoodRecommendations;
