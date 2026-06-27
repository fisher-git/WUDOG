import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('admin_permission')
export class AdminPermission {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ unique: true, length: 100 })
  code: string;

  @Column({ length: 50 })
  name: string;

  @Column({ length: 50, nullable: true, name: 'perm_group' })
  group: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
