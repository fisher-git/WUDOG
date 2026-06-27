import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('recommendation_slot')
export class RecommendationSlot {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ length: 100, name: 'slot_name' })
  slotName: string;

  @Column({ length: 50, name: 'content_type' })
  contentType: string;

  @Column({ type: 'bigint', name: 'content_id' })
  contentId: number;

  @Column({ type: 'int', default: 0, name: 'sort_order' })
  sortOrder: number;

  @Column({ type: 'enum', enum: ['draft', 'published', 'archived'], default: 'published' })
  status: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
