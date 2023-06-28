import { Column, PrimaryGeneratedColumn, Entity, OneToOne, OneToMany, JoinColumn, ManyToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Gate } from './Gate';
import { Solicitation } from './Solicitation';
import { Role } from './Role';

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

    @OneToOne(() => Role, { cascade: true })
    @JoinColumn({ name: 'role_id' })
    role: Role;

    @CreateDateColumn({ type: 'timestamptz' })
    created_at: Date

    @UpdateDateColumn({ type: 'timestamptz' })
    updated_at: Date

    @ManyToMany(() => Gate, gate => gate.users)
    gates: Gate[]

    @OneToMany(() => Solicitation, solicitation => solicitation.user)
    solicitations: Solicitation[]
}