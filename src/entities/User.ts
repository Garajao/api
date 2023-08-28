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
