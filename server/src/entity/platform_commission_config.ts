import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('platform_commission_config')
export class PlatformCommissionConfig {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'enum', enum: ['clothing', 'food', 'lodging', 'travel'], unique: true })
  module: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, name: 'commission_rate', default: 10.00 })
  commissionRate: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
