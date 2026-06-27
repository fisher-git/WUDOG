import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { message } from 'antd';
import { getToken, removeToken, getRefreshToken, setToken, setRefreshToken } from '../utils/token';

const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器：自动注入 Bearer Token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

// 是否正在刷新Token
let isRefreshing = false;
let pendingRequests: Array<(token: string) => void> = [];

function subscribeTokenRefresh(cb: (token: string) => void) {
  pendingRequests.push(cb);
}

function onTokenRefreshed(token: string) {
  pendingRequests.forEach((cb) => cb(token));
  pendingRequests = [];
}

// 响应拦截器：统一返回 response.data
api.interceptors.response.use(
  (response) => response.data,
  async (error: AxiosError) => {
    const { config, response } = error;

    if (response?.status === 401 && config) {
      const originalRequest = config as InternalAxiosRequestConfig & { _retry?: boolean };

      // 如果已经在登录页，不处理
      if (window.location.pathname === '/login') {
        return Promise.reject(error);
      }

      // 尝试刷新 Token
      const refreshToken = getRefreshToken();
      if (refreshToken && !originalRequest._retry) {
        if (!isRefreshing) {
          isRefreshing = true;
          try {
            const res = await axios.post('/api/admin/auth/refresh', { refreshToken });
            const { token: newToken, refreshToken: newRefreshToken } = res.data.data;
            setToken(newToken);
            setRefreshToken(newRefreshToken);
            onTokenRefreshed(newToken);
            originalRequest._retry = true;
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return api(originalRequest);
          } catch {
            pendingRequests = [];
            removeToken();
            message.error('登录已过期，请重新登录');
            window.location.href = '/login';
            return Promise.reject(error);
          } finally {
            isRefreshing = false;
          }
        } else {
          return new Promise((resolve) => {
            subscribeTokenRefresh((token: string) => {
              originalRequest._retry = true;
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(api(originalRequest));
            });
          });
        }
      }

      removeToken();
      message.error('登录已过期，请重新登录');
      window.location.href = '/login';
    }

    // 通用错误处理
    const errMsg = (response?.data as any)?.message || '请求失败';
    if (response?.status !== 401) {
      message.error(errMsg);
    }

    return Promise.reject(error);
  },
);

export default api;
