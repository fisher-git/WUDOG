var auth = require('../../utils/auth');

Page({
  data: {
    isLoggedIn: false,
    userInfo: null,
    orderCounts: { pendingPay: 0, pendingShip: 0, pendingReceive: 0, pendingReview: 0 },
    unreadMessages: 0,
  },
  onShow: function() {
    var loggedIn = auth.checkLoginStatus();
    if (loggedIn) {
      var userInfo = wx.getStorageSync('userInfo');
      this.setData({ isLoggedIn: true, userInfo: userInfo, unreadMessages: 3 });
    } else {
      this.setData({ isLoggedIn: false, userInfo: null });
    }
  },
  onLogin: function() {
    wx.navigateTo({ url: '/pages/login/index' });
  },
  onNavigate: function(e) {
    var page = e.currentTarget.dataset.page;
    if (!this.data.isLoggedIn && page !== 'settings') {
      wx.showToast({ title: '请先登录', icon: 'none' });
      return;
    }
    wx.navigateTo({ url: '/pages/' + page + '/index' });
  },
  onLogout: function() {
    var self = this;
    wx.showModal({
      title: '退出登录',
      content: '确定要退出登录吗？',
      success: function(res) {
        if (res.confirm) {
          auth.logout();
          self.setData({ isLoggedIn: false, userInfo: null });
        }
      }
    });
  },
});
