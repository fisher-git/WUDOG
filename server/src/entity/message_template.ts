import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('message_template')
export class MessageTemplate {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ unique: true, length: 50 })
  code: string;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 200, name: 'title_template' })
  titleTemplate: string;

  @Column({ type: 'text', name: 'content_template' })
  contentTemplate: string;

  @Column({ type: 'enum', enum: ['system', 'order', 'refund', 'notification'] })
  type: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
