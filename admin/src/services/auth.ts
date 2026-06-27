import api from './api';
import type {
  ApiResponse,
  AuthLoginRequest,
  AuthLoginResponse,
  SendSmsRequest,
  RefreshTokenRequest,
  RefreshTokenResponse,
} from '@wudong/shared';

export function login(data: AuthLoginRequest) {
  return api.post<ApiResponse<AuthLoginResponse>>('/admin/auth/login', data);
}

export function logout() {
  return api.post<ApiResponse<null>>('/admin/auth/logout');
}

export function refresh(data?: RefreshTokenRequest) {
  return api.post<ApiResponse<RefreshTokenResponse>>('/admin/auth/refresh', data || {});
}

export function sendSms(data: SendSmsRequest) {
  return api.post<ApiResponse<null>>('/admin/auth/send-sms', data);
}
