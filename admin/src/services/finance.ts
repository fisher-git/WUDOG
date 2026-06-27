import api from './api';
import type {
  ApiResponse,
  PaginatedData,
  SettlementSheetInfo,
  SettlementRecordInfo,
  PageQuery,
} from '@wudong/shared';

export interface SettlementQuery extends PageQuery {
  merchantId?: number;
  module?: string;
  status?: string;
  period?: string;
}

export function getSettlements(params: SettlementQuery) {
  return api.get<ApiResponse<PaginatedData<SettlementSheetInfo>>>('/admin/finance/settlements', { params });
}

export function getSettlementDetail(id: number) {
  return api.get<ApiResponse<{ sheet: SettlementSheetInfo; records: SettlementRecordInfo[] }>>(
    `/admin/finance/settlements/${id}`,
  );
}

export function generateSettlement(data: { merchantId: number; period: string }) {
  return api.post<ApiResponse<SettlementSheetInfo>>('/admin/finance/settlements/generate', data);
}

export function confirmSettlement(id: number) {
  return api.post<ApiResponse<null>>(`/admin/finance/settlements/${id}/confirm`);
}
