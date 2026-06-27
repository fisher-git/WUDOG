import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('admin_role_permission')
export class AdminRolePermission {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'bigint', name: 'role_id' })
  roleId: number;

  @Column({ type: 'bigint', name: 'permission_id' })
  permissionId: number;
}
