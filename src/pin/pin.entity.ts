import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {Device} from '../device/device.entity';
import {ElectricalContactEnum} from "./types/electrical-contact.enum";

@Entity()
export class Pin {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne((type) => Device, (type) => type.pins, { eager: true })
    device: Device;

    @Column()
    pinNumber: string;

    @Column()
    electricalContact: ElectricalContactEnum;

    @Column()
    createdAt: string;

    @Column({ nullable: true })
    updatedAt: string;
}