import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/home/index';
import LoginPage from './pages/login/index';
import RegisterPage from './pages/register/index';
import MerchantApplyPage from './pages/merchant-apply/index';

const NotFound: React.FC = () => (
  <div style={{ textAlign: 'center', padding: 100 }}>
    <h1 style={{ fontSize: 72, color: '#1B3A5C' }}>404</h1>
    <p style={{ fontSize: 18, color: '#999' }}>页面未找到</p>
    <a href="/">返回首页</a>
  </div>
);

const App: React.FC = () => (
  <Routes>
    <Route element={<MainLayout />}>
      <Route path="/" element={<HomePage />} />
    </Route>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route path="/merchant-apply" element={<MerchantApplyPage />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default App;
