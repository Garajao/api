import {
  Column,
  PrimaryGeneratedColumn,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm'

import { User } from './User'

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
