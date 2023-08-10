import { Column, PrimaryGeneratedColumn, Entity, OneToMany, ManyToMany, CreateDateColumn, UpdateDateColumn, JoinTable } from 'typeorm';
import { Solicitation } from './Solicitation';
import { User } from './User';

@Entity('gates')
export class Gate {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ type: 'text' })
    name: string

    @Column({ type: 'boolean', default: false })
    open: Boolean

    @Column({ type: 'boolean', default: false })
    provisional_open: Boolean

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

    @Column({ type: 'timestamptz' })
    consulted_at: Date

    @CreateDateColumn({ type: 'timestamptz' })
    created_at: Date

    @UpdateDateColumn({ type: 'timestamptz' })
    updated_at: Date

    @OneToMany(() => Solicitation, solicitation => solicitation.gate)
    solicitations: Solicitation[]

    @ManyToMany(() => User, user => user.gates)
    @JoinTable({
        name: 'user_gate',
        joinColumn: {
            name: 'gate_id',
            referencedColumnName: 'id'
        },
        inverseJoinColumn: {
            name: 'user_id',
            referencedColumnName: 'id'
        }
    })
    users: User[]
}