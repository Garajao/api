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

/**
 * @swagger
 * components:
 *   schemas:
 *     Device:
 *       type: object
 *       required:
 *         - id
 *         - os
 *         - model
 *         - push_token
 *         - created_at
 *         - updated_at
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the device
 *         os:
 *           type: string
 *           description: The operating system of the device
 *         model:
 *           type: string
 *           description: The model of the device
 *         name:
 *           type: string
 *           description: The name of the device
 *         push_token:
 *           type: string
 *           description: The push token of the device
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: The date and time the device was created
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: The date and time the device was updated
 *         deleted_at:
 *           type: string
 *           format: date-time
 *           description: The date and time the device was deleted
 *         user:
 *           $ref: '#/components/schemas/User'
 *           description: The user associated with the device
 *         notifications:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Notification'
 *           description: The notifications associated with the device
 */
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
