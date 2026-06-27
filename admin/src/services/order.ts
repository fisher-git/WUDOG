import api from './api';
import type { ApiResponse, PaginatedData, OrderStatus, PageQuery } from '@wudong/shared';

export interface OrderInfo {
  id: number;
  orderNo: string;
  module: string;
  merchantId: number;
  merchantName: string;
  userId: number;
  userName: string;
  amount: number;
  status: OrderStatus;
  createdAt: string;
  paidAt: string | null;
  shippedAt: string | null;
}

export interface OrderDetailInfo extends OrderInfo {
  items: Array<{
    productName: string;
    price: number;
    quantity: number;
    imageUrl: string;
  }>;
  address: {
    name: string;
    phone: string;
    province: string;
    city: string;
    district: string;
    detail: string;
  };
  timeline: Array<{
    status: string;
    label: string;
    time: string;
    operator: string;
  }>;
}

export interface OrderQuery extends PageQuery {
  keyword?: string;
  module?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}

export function getOrders(params: OrderQuery) {
  return api.get<ApiResponse<PaginatedData<OrderInfo>>>('/admin/orders', { params });
}

export function getOrderDetail(id: number) {
  return api.get<ApiResponse<OrderDetailInfo>>(`/admin/orders/${id}`);
}

export function approveRefund(id: number) {
  return api.post<ApiResponse<null>>(`/admin/orders/${id}/refund/approve`);
}

export function rejectRefund(id: number, reason: string) {
  return api.post<ApiResponse<null>>(`/admin/orders/${id}/refund/reject`, { reason });
}
