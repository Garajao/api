import { Column, PrimaryGeneratedColumn, JoinColumn, Entity, ManyToOne, CreateDateColumn, UpdateDateColumn, OneToOne } from 'typeorm';
import { Gate } from './Gate';
import { User } from './User';
import { Message } from './Message';

@Entity('solicitations')
export class Solicitation {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ type: 'boolean', default: false })
    status: Boolean

    @Column({ type: 'text', nullable: true })
    code: string

    @Column({ type: 'boolean', default: false })
    valid: Boolean

    @CreateDateColumn({ type: 'timestamptz' })
    created_at: Date

    @UpdateDateColumn({ type: 'timestamptz' })
    updated_at: Date

    @ManyToOne(() => Gate, gate => gate.solicitations, { nullable: false })
    @JoinColumn({ name: 'gate_id' })
    gate: Gate

    @ManyToOne(() => User, user => user.solicitations)
    @JoinColumn({ name: 'user_id' })
    user: User | null

    @ManyToOne(() => Message, message => message.solicitations, { nullable: false })
    @JoinColumn({ name: 'message_id' })
    message: Message | number;
}