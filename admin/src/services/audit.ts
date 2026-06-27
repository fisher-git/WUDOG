import api from './api';
import type { ApiResponse, PaginatedData, MerchantApplicationInfo, AuditRequest, PageQuery } from '@wudong/shared';

export interface ApplicationQuery extends PageQuery {
  status?: string;
  keyword?: string;
}

export function getApplications(params: ApplicationQuery) {
  return api.get<ApiResponse<PaginatedData<MerchantApplicationInfo>>>('/admin/audit/applications', { params });
}

export function getApplicationDetail(id: number) {
  return api.get<ApiResponse<MerchantApplicationInfo>>(`/admin/audit/applications/${id}`);
}

export function auditApplication(id: number, data: AuditRequest) {
  return api.post<ApiResponse<null>>(`/admin/audit/applications/${id}/audit`, data);
}
