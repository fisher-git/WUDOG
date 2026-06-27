import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('merchant_application')
export class MerchantApplication {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'bigint', name: 'user_id' })
  userId: number;

  @Column({ length: 100, name: 'shop_name' })
  shopName: string;

  @Column({ type: 'enum', enum: ['clothing', 'food', 'lodging', 'travel'], name: 'module' })
  module: string;

  @Column({ length: 50, name: 'contact_name' })
  contactName: string;

  @Column({ length: 20, name: 'contact_phone' })
  contactPhone: string;

  @Column({ length: 100, nullable: true, name: 'contact_email' })
  contactEmail: string;

  @Column({ type: 'text', nullable: true, name: 'shop_description' })
  shopDescription: string;

  @Column({ type: 'json', nullable: true })
  materials: string[];

  @Column({ type: 'enum', enum: ['pending', 'approved', 'rejected'], default: 'pending' })
  status: string;

  @Column({ type: 'bigint', nullable: true, name: 'reviewer_id' })
  reviewerId: number;

  @Column({ type: 'text', nullable: true, name: 'review_comment' })
  reviewComment: string;

  @Column({ type: 'datetime', nullable: true, name: 'reviewed_at' })
  reviewedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
