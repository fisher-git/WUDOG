import { BASE_URL } from './config';

interface RequestOptions {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data?: any;
  needAuth?: boolean;
}

export function request<T = any>(options: RequestOptions): Promise<T> {
  const { url, method = 'GET', data, needAuth = false } = options;
  const header: any = { 'Content-Type': 'application/json' };

  if (needAuth) {
    const token = wx.getStorageSync('token');
    if (token) header['Authorization'] = `Bearer ${token}`;
  }

  return new Promise((resolve, reject) => {
    wx.request({
      url: `${BASE_URL}${url}`,
      method,
      data,
      header,
      success(res: any) {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else if (res.statusCode === 401) {
          wx.removeStorageSync('token');
          wx.navigateTo({ url: '/pages/login/index' });
          reject(res.data);
        } else {
          wx.showToast({ title: res.data?.message || '请求失败', icon: 'none' });
          reject(res.data);
        }
      },
      fail(err) {
        wx.showToast({ title: '网络异常，请重试', icon: 'none' });
        reject(err);
      },
    });
  });
}
