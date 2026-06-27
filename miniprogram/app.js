App({
  globalData: {
    token: '',
    userInfo: null,
    baseUrl: 'http://localhost:7001/api',
  },
  onLaunch() {
    var token = wx.getStorageSync('token');
    if (token) {
      this.globalData.token = token;
    }
    wx.getSystemInfo({
      success: function(res) {
        this.globalData.systemInfo = res;
      }.bind(this),
    });
  },
});
