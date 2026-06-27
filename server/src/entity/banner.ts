import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('banner')
export class Banner {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ length: 100 })
  title: string;

  @Column({ length: 500, name: 'image_url' })
  imageUrl: string;

  @Column({ length: 500, nullable: true, name: 'link_url' })
  linkUrl: string;

  @Column({ type: 'int', default: 0, name: 'sort_order' })
  sortOrder: number;

  @Column({ type: 'enum', enum: ['draft', 'published', 'archived'], default: 'published' })
  status: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
