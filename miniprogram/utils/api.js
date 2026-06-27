var BASE_URL = require('./config').BASE_URL;

function request(options) {
  var url = options.url;
  var method = options.method || 'GET';
  var data = options.data;
  var needAuth = options.needAuth || false;
  var header = { 'Content-Type': 'application/json' };

  if (needAuth) {
    var token = wx.getStorageSync('token');
    if (token) header['Authorization'] = 'Bearer ' + token;
  }

  return new Promise(function(resolve, reject) {
    wx.request({
      url: BASE_URL + url,
      method: method,
      data: data,
      header: header,
      success: function(res) {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else if (res.statusCode === 401) {
          wx.removeStorageSync('token');
          wx.navigateTo({ url: '/pages/login/index' });
          reject(res.data);
        } else {
          wx.showToast({ title: res.data && res.data.message || '请求失败', icon: 'none' });
          reject(res.data);
        }
      },
      fail: function(err) {
        wx.showToast({ title: '网络异常，请重试', icon: 'none' });
        reject(err);
      },
    });
  });
}

module.exports = { request: request };
