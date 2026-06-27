import { Provide } from '@midwayjs/core';
import { ApiResponse, PaginatedData } from '@wudong/shared';

export interface GlobalOrderInfo {
  id: number;
  orderNo: string;
  module: string;
  merchantName: string;
  amount: number;
  status: string;
  createdAt: string;
}

@Provide()
export class OrderService {
  async getGlobalOrders(page: number, pageSize: number, module?: string, status?: string, keyword?: string): Promise<ApiResponse<PaginatedData<GlobalOrderInfo>>> {
    // MVP阶段：跨模块订单查询需要使用统一订单中心接口
    // 此处返回模拟数据结构
    const mockOrders: GlobalOrderInfo[] = [
      { id: 1, orderNo: 'ORD202606270001', module: 'clothing', merchantName: '苗寨银饰坊', amount: 358.00, status: 'paid', createdAt: '2026-06-27T10:30:00+08:00' },
      { id: 2, orderNo: 'ORD202606270002', module: 'food', merchantName: '苗家餐厅', amount: 128.00, status: 'confirmed', createdAt: '2026-06-27T11:00:00+08:00' },
      { id: 3, orderNo: 'ORD202606270003', module: 'lodging', merchantName: '苗寨客栈', amount: 688.00, status: 'pending_pay', createdAt: '2026-06-27T12:00:00+08:00' },
      { id: 4, orderNo: 'ORD202606260004', module: 'travel', merchantName: '景区运营', amount: 198.00, status: 'refunding', createdAt: '2026-06-26T09:00:00+08:00' },
    ];

    return {
      code: 200, message: '查询成功',
      data: { list: mockOrders, total: 4, page, pageSize },
    };
  }

  async getOrderDetail(id: number): Promise<ApiResponse<GlobalOrderInfo>> {
    return {
      code: 200, message: '查询成功',
      data: { id, orderNo: `ORD20260627000${id}`, module: 'clothing', merchantName: '苗寨银饰坊', amount: 358.00, status: 'paid', createdAt: '2026-06-27T10:30:00+08:00' },
    };
  }

  async approveRefund(id: number): Promise<ApiResponse<null>> {
    return { code: 200, message: '退款已批准', data: null };
  }

  async rejectRefund(id: number, reason: string): Promise<ApiResponse<null>> {
    return { code: 200, message: `退款已驳回: ${reason}`, data: null };
  }
}
