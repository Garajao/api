import { Column, PrimaryGeneratedColumn, Entity, CreateDateColumn, UpdateDateColumn, JoinColumn, ManyToOne } from 'typeorm';
import { Device } from './Device';

@Entity('notifications')
export class Notification {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ type: 'text' })
    title: string

    @Column({ type: 'text' })
    body: string

    @Column({ type: 'uuid', nullable: true })
    expo_id: string
    
    @Column({ type: 'text', nullable: true })
    expo_status: string
    
    @Column({ type: 'text', nullable: true })
    expo_message: string

    @CreateDateColumn({ type: 'timestamptz' })
    created_at: Date

    @UpdateDateColumn({ type: 'timestamptz' })
    updated_at: Date

    @ManyToOne(() => Device, device => device.notifications)
    @JoinColumn({ name: 'device_id' })
    device: Device
}