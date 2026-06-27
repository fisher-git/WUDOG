import api from './api';
import type { ApiResponse, PaginatedData, MerchantInfo, PageQuery } from '@wudong/shared';

export interface TouristInfo {
  id: number;
  username: string;
  name: string;
  avatar: string;
  phone: string;
  status: string;
  registeredAt: string;
  lastLoginAt: string;
}

export interface TouristQuery extends PageQuery {
  keyword?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}

export function getTouristList(params: TouristQuery) {
  return api.get<ApiResponse<PaginatedData<TouristInfo>>>('/admin/users/tourists', { params });
}

export function getTouristDetail(id: number) {
  return api.get<ApiResponse<TouristInfo>>(`/admin/users/tourists/${id}`);
}

export function banTourist(id: number) {
  return api.put<ApiResponse<null>>(`/admin/users/tourists/${id}/ban`);
}

export function unbanTourist(id: number) {
  return api.put<ApiResponse<null>>(`/admin/users/tourists/${id}/unban`);
}

export interface MerchantQuery extends PageQuery {
  keyword?: string;
  module?: string;
  status?: string;
}

export function getMerchantList(params: MerchantQuery) {
  return api.get<ApiResponse<PaginatedData<MerchantInfo>>>('/admin/users/merchants', { params });
}

export function getMerchantDetail(id: number) {
  return api.get<ApiResponse<MerchantInfo>>(`/admin/users/merchants/${id}`);
}

export function updateMerchantStatus(id: number, status: string) {
  return api.put<ApiResponse<null>>(`/admin/users/merchants/${id}/status`, { status });
}
