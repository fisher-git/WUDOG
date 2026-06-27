const TOKEN_KEY = 'wudong_admin_token';
const REFRESH_TOKEN_KEY = 'wudong_admin_refresh_token';
const USER_INFO_KEY = 'wudong_admin_user_info';

export interface StoredUserInfo {
  id: number;
  username: string;
  name: string;
  roleId: number;
  roleName: string;
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_INFO_KEY);
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setRefreshToken(token: string): void {
  localStorage.setItem(REFRESH_TOKEN_KEY, token);
}

export function getUserInfo(): StoredUserInfo | null {
  const raw = localStorage.getItem(USER_INFO_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredUserInfo;
  } catch {
    return null;
  }
}

export function setUserInfo(info: StoredUserInfo): void {
  localStorage.setItem(USER_INFO_KEY, JSON.stringify(info));
}
