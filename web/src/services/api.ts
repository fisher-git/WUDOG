import axios from 'axios';

const api = axios.create({ baseURL: '/api', timeout: 15000 });
api.interceptors.response.use(
  (res) => res.data,
  (err) => { const msg = err.response?.data?.message || '网络请求失败'; return Promise.reject(new Error(msg)); },
);
export default api;
