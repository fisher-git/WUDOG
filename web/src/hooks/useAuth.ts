import { useState, useEffect } from 'react';

export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      try { setUser(JSON.parse(localStorage.getItem('user') || '{}')); } catch { /* ignore */ }
    }
  }, []);

  const login = (token: string, userInfo: any) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userInfo));
    setIsLoggedIn(true);
    setUser(userInfo);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
  };

  return { isLoggedIn, user, login, logout };
}
