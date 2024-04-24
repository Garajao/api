import {
  Column,
  PrimaryGeneratedColumn,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm'

import { Solicitation } from './Solicitation'

/**
 * @swagger
 * components:
 *   schemas:
 *     Message:
 *       type: object
 *       required:
 *         - id
 *         - description
 *         - created_at
 *         - updated_at
 *       properties:
 *         id:
 *           type: number
 *           description: The auto-generated id of the message
 *         description:
 *           type: string
 *           description: The description of the message
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: The date and time the message was created
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: The date and time the message was updated
 *         solicitations:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Solicitation'
 *           description: The solicitations associated with the message
 */
@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'text' })
  description: string

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date

  @OneToMany(() => Solicitation, (solicitation) => solicitation.message)
  solicitations: Solicitation[]
}
