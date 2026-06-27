import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as loginApi, logout as logoutApi, refresh as refreshApi } from '../services/auth';
import { getUserInfo, getToken, setToken, setRefreshToken, removeToken, setUserInfo, type StoredUserInfo } from '../utils/token';
import { setPermissions } from '../utils/permissions';
import { message } from 'antd';

export interface AuthState {
  user: StoredUserInfo | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
}

export function useAuth() {
  const navigate = useNavigate();
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    loading: true,
    isAuthenticated: false,
  });

  const checkAuth = useCallback(() => {
    const token = getToken();
    const user = getUserInfo();
    if (token && user) {
      setState({ user, token, loading: false, isAuthenticated: true });
    } else {
      setState({ user: null, token: null, loading: false, isAuthenticated: false });
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = useCallback(
    async (username: string, password: string, smsCode?: string, captchaId?: string, captchaCode?: string) => {
      try {
        const res: any = await loginApi({ username, password, smsCode, captchaId, captchaCode } as any);
        // 拦截器返回 response.data，所以 res = { code, message, data }
        if (res.code !== 200 || !res.data) {
          throw new Error(res.message || '登录失败');
        }
        const { token, refreshToken, userInfo } = res.data;
        if (!token) throw new Error('登录响应缺少token');
        setToken(token);
        setRefreshToken(refreshToken || token);
        setUserInfo(userInfo);
        if (res.data.permissions) setPermissions(res.data.permissions);
        setState({
          user: userInfo,
          token,
          loading: false,
          isAuthenticated: true,
        });
        message.success('登录成功');
        return true;
      } catch (err: any) {
        message.error(err?.message || '登录失败');
        return false;
      }
    },
    [],
  );

  const logout = useCallback(async () => {
    try {
      await logoutApi();
    } catch {
      // ignore
    } finally {
      removeToken();
      setState({ user: null, token: null, loading: false, isAuthenticated: false });
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  const refresh = useCallback(async () => {
    try {
      const res: any = await refreshApi();
      const { token, refreshToken } = res.data;
      setToken(token);
      setRefreshToken(refreshToken);
      setState((prev) => ({ ...prev, token }));
    } catch {
      logout();
    }
  }, [logout]);

  return {
    ...state,
    login,
    logout,
    refresh,
    checkAuth,
  };
}
