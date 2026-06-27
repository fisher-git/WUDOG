import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('sensitive_word')
export class SensitiveWord {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ length: 100, unique: true })
  word: string;

  @Column({ length: 50, nullable: true })
  category: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
