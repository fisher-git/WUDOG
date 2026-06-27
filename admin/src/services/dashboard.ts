import api from './api';
import type { ApiResponse } from '@wudong/shared';

export interface DashboardOverview {
  dau: number;
  dauChange: number;
  newUsers: number;
  newUsersChange: number;
  totalOrders: number;
  ordersChange: number;
  gmv: number;
  gmvChange: number;
  orderTrend: Array<{ date: string; module: string; count: number }>;
  userGrowth: Array<{ date: string; count: number }>;
  contentStats: Array<{ name: string; value: number }>;
  funnelData: Array<{ name: string; value: number }>;
  moduleBreakdown: Array<{ module: string; amount: number }>;
}

export function getOverview(range: string = 'week') {
  return api.get<ApiResponse<DashboardOverview>>('/admin/dashboard/overview', { params: { range } });
}
