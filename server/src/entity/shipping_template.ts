import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('shipping_template')
export class ShippingTemplate {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ type: 'decimal', precision: 8, scale: 2, name: 'default_fee', default: 0 })
  defaultFee: number;

  @Column({ type: 'decimal', precision: 8, scale: 2, name: 'free_threshold', default: 0 })
  freeThreshold: number;

  @Column({ type: 'text', nullable: true, name: 'region_rules' })
  regionRules: string;

  @Column({ type: 'enum', enum: ['published', 'archived'], default: 'published' })
  status: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
