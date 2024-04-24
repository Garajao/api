import {
  Column,
  PrimaryGeneratedColumn,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm'

import { User } from './User'

/**
 * @swagger
 * components:
 *   schemas:
 *     Role:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - level
 *         - created_at
 *         - updated_at
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the role
 *         name:
 *           type: string
 *           description: The name of the role
 *         level:
 *           type: number
 *           description: The level of the role
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: The date and time the role was created
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: The date and time the role was updated
 *         users:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/User'
 *           description: The users associated with the role
 */
@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'text' })
  name: string

  @Column({ type: 'int' })
  level: number

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date

  @OneToMany(() => User, (user) => user.role)
  users: User[]
}
