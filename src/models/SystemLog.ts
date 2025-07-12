import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './User';

@Entity('system_logs')
export class SystemLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  level: string;

  @Column()
  message: string;

  @Column('jsonb', { nullable: true })
  context: any;

  @Column({ nullable: true })
  module: string;

  @Column({ name: 'user_id', nullable: true })
  userId: string;

  @Column('inet', { name: 'ip_address', nullable: true })
  ipAddress: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}