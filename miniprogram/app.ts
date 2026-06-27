App({
  globalData: {
    token: '',
    userInfo: null,
    baseUrl: 'http://localhost:7001/api',
  },
  onLaunch() {
    const token = wx.getStorageSync('token');
    if (token) {
      this.globalData.token = token;
    }
    wx.getSystemInfo({
      success: (res) => {
        this.globalData.systemInfo = res;
      },
    });
  },
});
