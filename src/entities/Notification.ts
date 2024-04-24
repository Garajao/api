import {
  Column,
  PrimaryGeneratedColumn,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm'

import { Device } from './Device'

/**
 * @swagger
 * components:
 *   schemas:
 *     Notification:
 *       type: object
 *       required:
 *         - id
 *         - title
 *         - body
 *         - created_at
 *         - updated_at
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the notification
 *         title:
 *           type: string
 *           description: The title of the notification
 *         body:
 *           type: string
 *           description: The body of the notification
 *         expo_id:
 *           type: string
 *           nullable: true
 *           description: The expo id of the notification
 *         expo_status:
 *           type: string
 *           nullable: true
 *           description: The expo status of the notification
 *         expo_message:
 *           type: string
 *           nullable: true
 *           description: The expo message of the notification
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: The date and time the notification was created
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: The date and time the notification was updated
 *         device:
 *           $ref: '#/components/schemas/Device'
 *           description: The device associated with the notification
 */
@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'text' })
  title: string

  @Column({ type: 'text' })
  body: string

  @Column({ type: 'uuid', nullable: true })
  expo_id: string

  @Column({ type: 'text', nullable: true })
  expo_status: string

  @Column({ type: 'text', nullable: true })
  expo_message: string

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date

  @ManyToOne(() => Device, (device) => device.notifications)
  @JoinColumn({ name: 'device_id' })
  device: Device
}
