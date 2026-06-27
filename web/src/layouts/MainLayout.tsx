import React from 'react';
import { Outlet } from 'react-router-dom';
import { Layout } from 'antd';
import Header from '../components/Header';
import Footer from '../components/Footer';

const MainLayout: React.FC = () => (
  <Layout style={{ minHeight: '100vh', background: '#F8F7F4' }}>
    <Header />
    <Layout.Content style={{ paddingTop: 64 }}>
      <Outlet />
    </Layout.Content>
    <Footer />
  </Layout>
);

export default MainLayout;
