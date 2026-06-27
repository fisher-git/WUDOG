export enum UserStatus {
  ACTIVE = 'active',
  BANNED = 'banned',
}

export enum AdminStatus {
  ACTIVE = 'active',
  DISABLED = 'disabled',
}

export enum MerchantStatus {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  CLOSED = 'closed',
}

export enum AuditStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export enum SettlementStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PAID = 'paid',
}

export enum MessageType {
  SYSTEM = 'system',
  ORDER = 'order',
  REFUND = 'refund',
  NOTIFICATION = 'notification',
}

export enum ModuleType {
  CLOTHING = 'clothing',
  FOOD = 'food',
  LODGING = 'lodging',
  TRAVEL = 'travel',
}

export enum OrderStatus {
  PENDING_PAY = 'pending_pay',
  PAID = 'paid',
  CONFIRMED = 'confirmed',
  SHIPPED = 'shipped',
  RECEIVED = 'received',
  REFUNDING = 'refunding',
  REFUNDED = 'refunded',
  CANCELLED = 'cancelled',
}

export enum ContentStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}
