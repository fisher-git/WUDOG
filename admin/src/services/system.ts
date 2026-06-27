import api from './api';
import type { ApiResponse, PaginatedData, CommissionConfigInfo, PageQuery } from '@wudong/shared';

// 系统配置
export interface SystemConfig {
  siteName: string;
  logo: string;
  favicon: string;
  icpBeian: string;
  contactPhone: string;
  contactEmail: string;
}

export function getConfig() {
  return api.get<ApiResponse<SystemConfig>>('/admin/system/config');
}

export function setConfig(data: Partial<SystemConfig>) {
  return api.put<ApiResponse<null>>('/admin/system/config', data);
}

// 佣金配置
export function getCommissionConfigs() {
  return api.get<ApiResponse<CommissionConfigInfo[]>>('/admin/system/commission');
}

export function updateCommission(id: number, rate: number) {
  return api.put<ApiResponse<null>>(`/admin/system/commission/${id}`, { commissionRate: rate });
}

// 敏感词管理
export interface SensitiveWord {
  id: number;
  word: string;
  level: string;
  createdAt: string;
}

export function getSensitiveWords(params: PageQuery) {
  return api.get<ApiResponse<PaginatedData<SensitiveWord>>>('/admin/system/sensitive-words', { params });
}

export function addSensitiveWord(data: { word: string; level: string }) {
  return api.post<ApiResponse<SensitiveWord>>('/admin/system/sensitive-words', data);
}

export function deleteSensitiveWord(id: number) {
  return api.delete<ApiResponse<null>>(`/admin/system/sensitive-words/${id}`);
}

export function batchImportSensitiveWords(words: string[]) {
  return api.post<ApiResponse<{ imported: number }>>('/admin/system/sensitive-words/batch', { words });
}

// 物流模板
export interface ShippingTemplate {
  id: number;
  name: string;
  carrier: string;
  basePrice: number;
  perUnitPrice: number;
  freeThreshold: number;
  estimatedDays: string;
  regions: string[];
  status: string;
  createdAt: string;
}

export function getShippingTemplates(params: PageQuery) {
  return api.get<ApiResponse<PaginatedData<ShippingTemplate>>>('/admin/system/shipping', { params });
}

export function createShippingTemplate(data: Omit<ShippingTemplate, 'id' | 'createdAt'>) {
  return api.post<ApiResponse<ShippingTemplate>>('/admin/system/shipping', data);
}

export function updateShippingTemplate(id: number, data: Partial<ShippingTemplate>) {
  return api.put<ApiResponse<ShippingTemplate>>(`/admin/system/shipping/${id}`, data);
}

export function deleteShippingTemplate(id: number) {
  return api.delete<ApiResponse<null>>(`/admin/system/shipping/${id}`);
}

// 支付配置
export interface PaymentConfig {
  merchantId: string;
  apiKey: string;
  notifyUrl: string;
}

export function getPaymentConfig() {
  return api.get<ApiResponse<PaymentConfig>>('/admin/system/payment');
}

export function setPaymentConfig(data: PaymentConfig) {
  return api.put<ApiResponse<null>>('/admin/system/payment', data);
}

// 短信配置
export interface SmsConfig {
  provider: string;
  accessKeyId: string;
  accessKeySecret: string;
  signName: string;
  templateCode: string;
}

export function getSmsConfig() {
  return api.get<ApiResponse<SmsConfig>>('/admin/system/sms');
}

export function setSmsConfig(data: SmsConfig) {
  return api.put<ApiResponse<null>>('/admin/system/sms', data);
}
