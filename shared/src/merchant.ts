import { MerchantStatus, ModuleType, AuditStatus } from './enums';

export interface MerchantInfo {
  id: number;
  username: string;
  shopName: string;
  module: ModuleType;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  status: MerchantStatus;
  settledAt: string;
  createdAt: string;
}

export interface MerchantApplicationInfo {
  id: number;
  userId: number;
  shopName: string;
  module: ModuleType;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  shopDescription: string;
  materials: string[];
  status: AuditStatus;
  reviewerId: number | null;
  reviewComment: string | null;
  reviewedAt: string | null;
  createdAt: string;
}

export interface MerchantApplicationRequest {
  shopName: string;
  module: ModuleType;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  shopDescription: string;
  materials: string[];
}

export interface AuditRequest {
  action: 'approve' | 'reject';
  module?: ModuleType;
  reason?: string;
}
