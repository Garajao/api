import { Column, PrimaryGeneratedColumn, JoinColumn, Entity, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Gate } from './Gate';
import { User } from './User';

@Entity('solicitations')
export class Solicitation {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ type: 'boolean', default: false })
    status: Boolean

    @Column({ type: 'text' })
    method: string

    @Column({ type: 'int' })
    status_code: number

    @Column({ type: 'text' })
    message: string

    @Column({ type: 'text', nullable: true })
    code: string

    @Column({ type: 'boolean', default: false })
    valid: Boolean

    @CreateDateColumn({ type: 'timestamptz' })
    created_at: Date

    @UpdateDateColumn({ type: 'timestamptz' })
    updated_at: Date

    @ManyToOne(() => Gate, gate => gate.solicitations)
    @JoinColumn({ name: 'gate_id' })
    gate: Gate

    @ManyToOne(() => User, user => user.solicitations)
    @JoinColumn({ name: 'user_id' })
    user: User | null
}