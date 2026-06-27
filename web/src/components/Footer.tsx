import React from 'react';
import { Layout, Row, Col, Divider } from 'antd';
import { EnvironmentOutlined, PhoneOutlined, MailOutlined } from '@ant-design/icons';

const Footer: React.FC = () => (
  <Layout.Footer style={{ background: '#1B3A5C', color: '#ccc', padding: '48px 24px 24px' }}>
    <div style={{ maxWidth: 1280, margin: '0 auto' }}>
      <Row gutter={[48, 32]}>
        <Col xs={24} sm={8}>
          <h3 style={{ color: '#C8A45C', fontSize: 20, marginBottom: 16 }}>🏔 乌东文旅</h3>
          <p style={{ lineHeight: 2, marginBottom: 16 }}>乌东文旅是贵州黔东南苗族侗族自治州特色苗寨的一站式数字化文旅服务平台，覆盖衣、食、住、行全链路，让每一位游客感受苗族文化的独特魅力。</p>
          <p><EnvironmentOutlined /> 贵州省黔东南苗族侗族自治州乌东村</p>
          <p><PhoneOutlined /> 400-123-4567</p>
          <p><MailOutlined /> hello@wudong-travel.com</p>
        </Col>
        <Col xs={12} sm={8}>
          <h4 style={{ color: '#fff', marginBottom: 16 }}>服务支持</h4>
          <p style={{ cursor: 'pointer', marginBottom: 8 }}>› 帮助中心</p>
          <p style={{ cursor: 'pointer', marginBottom: 8 }}>› 联系客服</p>
          <p style={{ cursor: 'pointer', marginBottom: 8 }}>› 商家入驻</p>
          <p style={{ cursor: 'pointer', marginBottom: 8 }}>› 合作咨询</p>
          <p style={{ cursor: 'pointer' }}>› 隐私政策</p>
        </Col>
        <Col xs={12} sm={8}>
          <h4 style={{ color: '#fff', marginBottom: 16 }}>关注我们</h4>
          <div style={{ width: 120, height: 120, background: '#fff', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999', fontSize: 12 }}>
            微信公众号
          </div>
          <p style={{ marginTop: 8, fontSize: 12 }}>扫码关注公众号</p>
        </Col>
      </Row>
      <Divider style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '32px 0 16px' }} />
      <p style={{ textAlign: 'center', fontSize: 13, color: '#999' }}>© 2026 乌东文旅 Wudong Travel. All rights reserved. | 黔ICP备XXXXXXXX号</p>
    </div>
  </Layout.Footer>
);

export default Footer;
