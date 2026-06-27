import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('announcement')
export class Announcement {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ length: 200 })
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'datetime', nullable: true, name: 'published_at' })
  publishedAt: Date;

  @Column({ type: 'enum', enum: ['draft', 'published', 'archived'], default: 'draft' })
  status: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
