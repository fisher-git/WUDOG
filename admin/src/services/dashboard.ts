import api from './api';
import type { ApiResponse } from '@wudong/shared';

export interface OrderTrendItem {
  date: string;
  clothing: number;
  food: number;
  lodging: number;
  travel: number;
}

export interface UserGrowthItem {
  date: string;
  count: number;
}

export interface ContentStatItem {
  type: string;
  count: number;
}

export interface TopMerchant {
  id: number;
  shopName: string;
  module: string;
  totalAmount: number;
  orderCount: number;
}

export interface MerchantStats {
  total: number;
  active: number;
  top: TopMerchant[];
}

export interface FinanceStats {
  totalRevenue: number;
  platformIncome: number;
  pendingSettlement: number;
}

export interface DashboardOverview {
  dau: number;
  newUsers: number;
  orderCount: number;
  gmv: number;
  totalUsers: number;
  totalMerchants: number;
  activeMerchants: number;
  orderTrend: OrderTrendItem[];
  userGrowth: UserGrowthItem[];
  contentStats: ContentStatItem[];
  merchantStats: MerchantStats;
  financeStats: FinanceStats;
}

export function getOverview(_range: string = 'week') {
  return api.get<ApiResponse<DashboardOverview>>('/admin/dashboard/overview');
}
