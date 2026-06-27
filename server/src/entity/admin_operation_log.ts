import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('admin_operation_log')
export class AdminOperationLog {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'bigint', name: 'operator_id' })
  operatorId: number;

  @Column({ length: 50, name: 'operator_name' })
  operatorName: string;

  @Column({ length: 50, name: 'action_type' })
  actionType: string;

  @Column({ length: 100, name: 'target_type' })
  targetType: string;

  @Column({ type: 'bigint', nullable: true, name: 'target_id' })
  targetId: number;

  @Column({ type: 'text', nullable: true, name: 'action_detail' })
  actionDetail: string;

  @Column({ length: 50, nullable: true })
  ip: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
