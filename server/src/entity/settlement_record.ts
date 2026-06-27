import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('settlement_record')
export class SettlementRecord {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'bigint', name: 'order_id' })
  orderId: number;

  @Column({ type: 'bigint', name: 'merchant_id' })
  merchantId: number;

  @Column({ length: 100, name: 'merchant_name' })
  merchantName: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'order_amount' })
  orderAmount: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, name: 'commission_rate' })
  commissionRate: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'commission_amount' })
  commissionAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'merchant_income' })
  merchantIncome: number;

  @Column({ type: 'enum', enum: ['pending', 'confirmed', 'paid'], default: 'pending' })
  status: string;

  @Column({ type: 'datetime', nullable: true, name: 'settled_at' })
  settledAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
