import { Column, PrimaryGeneratedColumn, Entity, CreateDateColumn, UpdateDateColumn } from 'typeorm';

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
}