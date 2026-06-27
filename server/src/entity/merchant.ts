import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('merchant')
export class Merchant {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ unique: true, length: 50 })
  username: string;

  @Column({ length: 255, name: 'password_hash' })
  passwordHash: string;

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

  @Column({ type: 'enum', enum: ['active', 'suspended', 'closed'], default: 'active' })
  status: string;

  @Column({ type: 'datetime', nullable: true, name: 'settled_at' })
  settledAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
