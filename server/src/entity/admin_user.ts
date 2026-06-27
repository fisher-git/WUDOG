import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('admin_user')
export class AdminUser {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ unique: true, length: 50 })
  username: string;

  @Column({ length: 255, name: 'password_hash' })
  passwordHash: string;

  @Column({ length: 50 })
  name: string;

  @Column({ length: 20, nullable: true })
  phone: string;

  @Column({ type: 'bigint', nullable: true, name: 'role_id' })
  roleId: number;

  @Column({ type: 'enum', enum: ['active', 'disabled'], default: 'active' })
  status: string;

  @Column({ type: 'datetime', nullable: true, name: 'last_login_at' })
  lastLoginAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
