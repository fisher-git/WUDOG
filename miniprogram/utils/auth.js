var request = require('./api').request;

function wxLogin() {
  return new Promise(function(resolve, reject) {
    wx.login({
      success: function(res) {
        if (res.code) {
          request({
            url: '/public/wechat-login',
            method: 'POST',
            data: { code: res.code },
          }).then(function(data) {
            if (data && data.data && data.data.token) {
              wx.setStorageSync('token', data.data.token);
              wx.setStorageSync('userInfo', data.data.userInfo);
              resolve(data.data);
            } else {
              reject(new Error('登录失败'));
            }
          }).catch(reject);
        } else {
          reject(new Error('wx.login失败'));
        }
      },
      fail: reject,
    });
  });
}

function checkLoginStatus() {
  return !!wx.getStorageSync('token');
}

function logout() {
  wx.removeStorageSync('token');
  wx.removeStorageSync('userInfo');
}

module.exports = {
  wxLogin: wxLogin,
  checkLoginStatus: checkLoginStatus,
  logout: logout,
};
