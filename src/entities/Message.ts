import { Column, PrimaryGeneratedColumn, Entity, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Solicitation } from './Solicitation';

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

    @OneToMany(() => Solicitation, solicitation => solicitation.message)
    solicitations: Solicitation[]
}