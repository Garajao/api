import {
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  Entity,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'

import { Gate } from './Gate'
import { User } from './User'
import { Message } from './Message'

/**
 * @swagger
 * components:
 *   schemas:
 *     Solicitation:
 *       type: object
 *       required:
 *         - id
 *         - status
 *         - valid
 *         - created_at
 *         - updated_at
 *         - gate
 *         - message
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the solicitation
 *         status:
 *           type: boolean
 *           description: The status of the solicitation
 *         code:
 *           type: string
 *           nullable: true
 *           description: The code of the solicitation
 *         valid:
 *           type: boolean
 *           description: Whether the solicitation is valid
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: The date and time the solicitation was created
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: The date and time the solicitation was last updated
 *         gate:
 *           $ref: '#/components/schemas/Gate'
 *           description: The gate associated with the solicitation
 *         user:
 *           nullable: true
 *           $ref: '#/components/schemas/User'
 *           description: The user associated with the solicitation
 *         message:
 *           $ref: '#/components/schemas/Message'
 *           description: The message associated with the solicitation
 */
@Entity('solicitations')
export class Solicitation {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'boolean', default: false })
  status: boolean

  @Column({ type: 'text', nullable: true })
  code: string

  @Column({ type: 'boolean', default: false })
  valid: boolean

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date

  @ManyToOne(() => Gate, (gate) => gate.solicitations, { nullable: false })
  @JoinColumn({ name: 'gate_id' })
  gate: Gate

  @ManyToOne(() => User, (user) => user.solicitations)
  @JoinColumn({ name: 'user_id' })
  user: User | null

  @ManyToOne(() => Message, (message) => message.solicitations, {
    nullable: false,
  })
  @JoinColumn({ name: 'message_id' })
  message: Message | number
}
