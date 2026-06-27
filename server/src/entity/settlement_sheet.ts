import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('settlement_sheet')
export class SettlementSheet {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'bigint', name: 'merchant_id' })
  merchantId: number;

  @Column({ length: 100, name: 'merchant_name' })
  merchantName: string;

  @Column({ length: 20 })
  period: string;

  @Column({ type: 'int', name: 'total_orders', default: 0 })
  totalOrders: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, name: 'total_amount', default: 0 })
  totalAmount: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, name: 'total_commission', default: 0 })
  totalCommission: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, name: 'total_income', default: 0 })
  totalIncome: number;

  @Column({ type: 'enum', enum: ['pending', 'confirmed', 'paid'], default: 'pending' })
  status: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
