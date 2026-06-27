import { checkLoginStatus, logout } from '../../utils/auth';

Page({
  data: {
    isLoggedIn: false,
    userInfo: null as any,
    orderCounts: { pendingPay: 0, pendingShip: 0, pendingReceive: 0, pendingReview: 0 },
    unreadMessages: 0,
  },
  onShow() {
    const loggedIn = checkLoginStatus();
    if (loggedIn) {
      const userInfo = wx.getStorageSync('userInfo');
      this.setData({ isLoggedIn: true, userInfo, unreadMessages: 3 });
    } else {
      this.setData({ isLoggedIn: false, userInfo: null });
    }
  },
  onLogin() {
    wx.navigateTo({ url: '/pages/login/index' });
  },
  onNavigate(e: any) {
    const page = e.currentTarget.dataset.page;
    if (!this.data.isLoggedIn && page !== 'settings') {
      wx.showToast({ title: '请先登录', icon: 'none' });
      return;
    }
    wx.navigateTo({ url: `/pages/${page}/index` });
  },
  onLogout() {
    wx.showModal({ title: '退出登录', content: '确定要退出登录吗？', success: (res) => {
      if (res.confirm) {
        logout();
        this.setData({ isLoggedIn: false, userInfo: null });
      }
    }});
  },
});
