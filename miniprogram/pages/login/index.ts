import { wxLogin } from '../../utils/auth';

Page({
  data: { loading: false, agreed: false },
  onToggleAgreement() { this.setData({ agreed: !this.data.agreed }); },
  async onWechatLogin() {
    if (!this.data.agreed) { wx.showToast({ title: '请先阅读并同意用户协议', icon: 'none' }); return; }
    this.setData({ loading: true });
    try {
      await wxLogin();
      wx.showToast({ title: '登录成功', icon: 'success' });
      setTimeout(() => wx.switchTab({ url: '/pages/index/index' }), 1000);
    } catch {
      wx.showToast({ title: '登录失败，请重试', icon: 'none' });
    } finally {
      this.setData({ loading: false });
    }
  },
});
