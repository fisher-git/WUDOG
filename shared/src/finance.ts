import { SettlementStatus } from './enums';

export interface SettlementRecordInfo {
  id: number;
  orderId: number;
  merchantId: number;
  merchantName: string;
  orderAmount: number;
  commissionRate: number;
  commissionAmount: number;
  merchantIncome: number;
  status: SettlementStatus;
  settledAt: string;
  createdAt: string;
}

export interface SettlementSheetInfo {
  id: number;
  merchantId: number;
  merchantName: string;
  period: string;
  totalOrders: number;
  totalAmount: number;
  totalCommission: number;
  totalIncome: number;
  status: SettlementStatus;
  createdAt: string;
}

export interface CommissionConfigInfo {
  id: number;
  module: string;
  commissionRate: number;
  updatedAt: string;
}
