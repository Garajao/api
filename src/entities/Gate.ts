import {
  Column,
  PrimaryGeneratedColumn,
  Entity,
  OneToMany,
  ManyToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinTable,
} from 'typeorm'

import { Solicitation } from './Solicitation'
import { User } from './User'

/**
 * @swagger
 * components:
 *   schemas:
 *     Gate:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - open
 *         - provisional_open
 *         - notified
 *         - cep
 *         - address
 *         - number
 *         - city
 *         - uf
 *         - created_at
 *         - updated_at
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the gate
 *         name:
 *           type: string
 *           description: The name of the gate
 *         open:
 *           type: boolean
 *           description: The status of the gate
 *         provisional_open:
 *           type: boolean
 *           description: The provisional status of the gate
 *         notified:
 *           type: boolean
 *           description: The notification status of the gate
 *         cep:
 *           type: string
 *           description: The CEP of the gate
 *         address:
 *           type: string
 *           description: The address of the gate
 *         complement:
 *           type: string
 *           description: The complement of the gate
 *         number:
 *           type: number
 *           description: The number of the gate
 *         city:
 *           type: string
 *           description: The city of the gate
 *         uf:
 *           type: string
 *           description: The UF of the gate
 *         image:
 *           type: string
 *           description: The image of the gate
 *         consulted_at:
 *           type: string
 *           format: date-time
 *           description: The date and time the gate was consulted
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: The date and time the gate was created
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: The date and time the gate was updated
 *         solicitations:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Solicitation'
 *           description: The solicitations associated with the gate
 *         users:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/User'
 */
@Entity('gates')
export class Gate {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'text' })
  name: string

  @Column({ type: 'boolean', default: false })
  open: boolean

  @Column({ type: 'boolean', default: false })
  provisional_open: boolean

  @Column({ type: 'boolean', default: false })
  notified: boolean

  @Column({ type: 'text' })
  cep: string

  @Column({ type: 'text' })
  address: string

  @Column({ type: 'text', nullable: true })
  complement: string

  @Column({ type: 'int' })
  number: number

  @Column({ type: 'text' })
  city: string

  @Column({ type: 'text' })
  uf: string

  @Column({ type: 'text', nullable: true })
  image: string

  @Column({ type: 'timestamptz', nullable: true })
  consulted_at: Date

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date

  @OneToMany(() => Solicitation, (solicitation) => solicitation.gate)
  solicitations: Solicitation[]

  @ManyToMany(() => User, (user) => user.gates)
  @JoinTable({
    name: 'user_gate',
    joinColumn: {
      name: 'gate_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
  })
  users: User[]
}
