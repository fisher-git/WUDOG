var auth = require('../../utils/auth');

Page({
  data: { loading: false, agreed: false },
  onToggleAgreement: function() { this.setData({ agreed: !this.data.agreed }); },
  onWechatLogin: function() {
    var self = this;
    if (!self.data.agreed) {
      wx.showToast({ title: '请先阅读并同意用户协议', icon: 'none' });
      return;
    }
    self.setData({ loading: true });
    auth.wxLogin().then(function() {
      wx.showToast({ title: '登录成功', icon: 'success' });
      setTimeout(function() { wx.switchTab({ url: '/pages/index/index' }); }, 1000);
    }).catch(function() {
      wx.showToast({ title: '登录失败，请重试', icon: 'none' });
    }).finally(function() {
      self.setData({ loading: false });
    });
  },
});
