import { request } from './api';

export function wxLogin(): Promise<any> {
  return new Promise((resolve, reject) => {
    wx.login({
      success(res) {
        if (res.code) {
          // 发送code到后端换取token
          request({
            url: '/public/wechat-login',
            method: 'POST',
            data: { code: res.code },
          }).then((data: any) => {
            if (data?.data?.token) {
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

export function checkLoginStatus(): boolean {
  return !!wx.getStorageSync('token');
}

export function logout(): void {
  wx.removeStorageSync('token');
  wx.removeStorageSync('userInfo');
}
