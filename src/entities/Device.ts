import {
  Column,
  PrimaryGeneratedColumn,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
  OneToMany,
  DeleteDateColumn,
} from 'typeorm'

import { User } from './User'
import { Notification } from './Notification'

@Entity('devices')
export class Device {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'text' })
  os: string

  @Column({ type: 'text' })
  model: string

  @Column({ type: 'text', nullable: true })
  name: string

  @Column({ type: 'text' })
  push_token: string

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date

  @DeleteDateColumn({ type: 'timestamptz' })
  deleted_at: Date

  @ManyToOne(() => User, (user) => user.solicitations)
  @JoinColumn({ name: 'user_id' })
  user: User

  @OneToMany(() => Notification, (notification) => notification.device)
  notifications: Notification[]
}
