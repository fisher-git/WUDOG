import React from 'react';
import { Card, DatePicker, Select, Button, Row, Col } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const AccommodationSearch: React.FC = () => (
  <div style={{ maxWidth: 1080, margin: '-40px auto 0', position: 'relative', zIndex: 10, padding: '0 24px' }}>
    <Card style={{ borderRadius: 16, boxShadow: '0 8px 40px rgba(0,0,0,0.12)' }}>
      <Row gutter={[16, 16]} align="middle">
        <Col xs={24} md={8}>
          <DatePicker placeholder="入住日期" style={{ width: '100%' }} size="large" />
        </Col>
        <Col xs={24} md={8}>
          <DatePicker placeholder="离店日期" style={{ width: '100%' }} size="large" />
        </Col>
        <Col xs={12} md={5}>
          <Select placeholder="人数" size="large" style={{ width: '100%' }} options={[{ value: 1, label: '1人' }, { value: 2, label: '2人' }, { value: 3, label: '3人' }, { value: 4, label: '4人+' }]} />
        </Col>
        <Col xs={12} md={3}>
          <Button type="primary" icon={<SearchOutlined />} size="large" block style={{ background: '#C8A45C', borderColor: '#C8A45C', height: 42 }}>搜索民宿</Button>
        </Col>
      </Row>
    </Card>
  </div>
);

export default AccommodationSearch;
