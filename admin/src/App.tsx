import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import MerchantLayout from './layouts/MerchantLayout';
import ProtectedRoute from './components/common/ProtectedRoute';
import LoginPage from './pages/login/index';

// Admin pages
import Dashboard from './pages/admin/Dashboard/index';
import TouristList from './pages/admin/UserManagement/TouristList';
import MerchantList from './pages/admin/UserManagement/MerchantList';
import UserDetail from './pages/admin/UserManagement/UserDetail';
import RolePermission from './pages/admin/RolePermission/index';
import OperationLog from './pages/admin/OperationLog/index';
import ApplicationList from './pages/admin/Audit/ApplicationList';
import ApplicationDetail from './pages/admin/Audit/ApplicationDetail';
import BannerManagement from './pages/admin/HomepageOps/BannerManagement';
import RecommendationManagement from './pages/admin/HomepageOps/RecommendationManagement';
import ActivityBannerManagement from './pages/admin/HomepageOps/ActivityBannerManagement';
import AnnouncementManagement from './pages/admin/HomepageOps/AnnouncementManagement';
import MessageSend from './pages/admin/MessageCenter/MessageSend';
import MessageTemplate from './pages/admin/MessageCenter/MessageTemplate';
import MessageHistory from './pages/admin/MessageCenter/MessageHistory';
import SettlementList from './pages/admin/Finance/SettlementList';
import SettlementDetail from './pages/admin/Finance/SettlementDetail';
import OrderList from './pages/admin/GlobalOrders/OrderList';
import OrderDetail from './pages/admin/GlobalOrders/OrderDetail';
import CommissionConfig from './pages/admin/SystemSettings/CommissionConfig';
import ShippingTemplate from './pages/admin/SystemSettings/ShippingTemplate';
import PaymentConfig from './pages/admin/SystemSettings/PaymentConfig';
import SmsConfig from './pages/admin/SystemSettings/SmsConfig';
import SensitiveWords from './pages/admin/SystemSettings/SensitiveWords';

// Merchant pages
import MerchantWorkbench from './pages/merchant/Workbench';
import StoreInfo from './pages/merchant/StoreInfo';
import DataStats from './pages/merchant/DataStats';
import MerchantMessages from './pages/merchant/Messages';
import AccountSettings from './pages/merchant/AccountSettings';

const App: React.FC = () => (
  <Routes>
    <Route path="/login" element={<LoginPage />} />

    {/* Admin Routes */}
    <Route
      path="/admin"
      element={
        <ProtectedRoute role="admin">
          <AdminLayout />
        </ProtectedRoute>
      }
    >
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<Dashboard />} />

      {/* User Management */}
      <Route path="users" element={<Navigate to="tourists" replace />} />
      <Route path="users/tourists" element={<TouristList />} />
      <Route path="users/merchants" element={<MerchantList />} />
      <Route path="users/tourist/:id" element={<UserDetail />} />
      <Route path="users/merchant/:id" element={<UserDetail />} />

      {/* Role & Permissions */}
      <Route path="roles" element={<RolePermission />} />

      {/* Audit */}
      <Route path="audit" element={<ApplicationList />} />
      <Route path="audit/:id" element={<ApplicationDetail />} />

      {/* Homepage Operations */}
      <Route path="homepage" element={<Navigate to="banners" replace />} />
      <Route path="homepage/banners" element={<BannerManagement />} />
      <Route path="homepage/recommendations" element={<RecommendationManagement />} />
      <Route path="homepage/activities" element={<ActivityBannerManagement />} />
      <Route path="homepage/announcements" element={<AnnouncementManagement />} />

      {/* Message Center */}
      <Route path="messages" element={<Navigate to="send" replace />} />
      <Route path="messages/send" element={<MessageSend />} />
      <Route path="messages/templates" element={<MessageTemplate />} />
      <Route path="messages/history" element={<MessageHistory />} />

      {/* Finance */}
      <Route path="finance" element={<Navigate to="settlements" replace />} />
      <Route path="finance/settlements" element={<SettlementList />} />
      <Route path="finance/settlements/:id" element={<SettlementDetail />} />

      {/* Global Orders */}
      <Route path="orders" element={<OrderList />} />
      <Route path="orders/:id" element={<OrderDetail />} />

      {/* System Settings */}
      <Route path="system" element={<Navigate to="commission" replace />} />
      <Route path="system/commission" element={<CommissionConfig />} />
      <Route path="system/shipping" element={<ShippingTemplate />} />
      <Route path="system/payment" element={<PaymentConfig />} />
      <Route path="system/sms" element={<SmsConfig />} />
      <Route path="system/sensitive-words" element={<SensitiveWords />} />

      {/* Operation Logs */}
      <Route path="logs" element={<OperationLog />} />
    </Route>

    {/* Merchant Routes */}
    <Route
      path="/merchant"
      element={
        <ProtectedRoute role="merchant">
          <MerchantLayout />
        </ProtectedRoute>
      }
    >
      <Route index element={<Navigate to="workbench" replace />} />
      <Route path="workbench" element={<MerchantWorkbench />} />
      <Route path="orders" element={<div>订单管理</div>} />
      <Route path="store" element={<StoreInfo />} />
      <Route path="stats" element={<DataStats />} />
      <Route path="messages" element={<MerchantMessages />} />
      <Route path="account" element={<AccountSettings />} />
    </Route>

    {/* Root redirect */}
    <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
    <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
  </Routes>
);

export default App;
