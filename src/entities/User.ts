import {
  Column,
  PrimaryGeneratedColumn,
  Entity,
  OneToMany,
  JoinColumn,
  ManyToMany,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm'

import { Gate } from './Gate'
import { Solicitation } from './Solicitation'
import { Role } from './Role'
import { Device } from './Device'

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - email
 *         - login
 *         - password
 *         - active
 *         - created_at
 *         - updated_at
 *         - role
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the user
 *         name:
 *           type: string
 *           description: The name of the user
 *         email:
 *           type: string
 *           description: The email of the user
 *         login:
 *           type: string
 *           description: The login of the user
 *         password:
 *           type: string
 *           description: The password of the user
 *         active:
 *           type: boolean
 *           description: The status of the user
 *         image:
 *           type: string
 *           nullable: true
 *           description: The image URL of the user
 *         last_login:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: The date and time of the user's last login
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: The date and time the user was created
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: The date and time the user was updated
 *         gates:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Gate'
 *           description: The gates associated with the user
 *         solicitations:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Solicitation'
 *           description: The solicitations made by the user
 *         role:
 *           $ref: '#/components/schemas/Role'
 *           description: The role of the user
 *         devices:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Device'
 *           description: The devices associated with the user
 */
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'text' })
  name: string

  @Column({ type: 'text', unique: true })
  email: string

  @Column({ type: 'text', unique: true })
  login: string

  @Column({ type: 'text' })
  password: string

  @Column({ type: 'boolean' })
  active: boolean

  @Column({ type: 'text', nullable: true })
  image: string

  @Column({ type: 'timestamptz', nullable: true })
  last_login: Date

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date

  @ManyToMany(() => Gate, (gate) => gate.users)
  gates: Gate[]

  @OneToMany(() => Solicitation, (solicitation) => solicitation.user)
  solicitations: Solicitation[]

  @ManyToOne(() => Role, (role) => role.users, { nullable: false })
  @JoinColumn({ name: 'role_id' })
  role: Role

  @OneToMany(() => Device, (device) => device.user)
  devices: Device[]
}
