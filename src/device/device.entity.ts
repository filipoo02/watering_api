import { User } from 'src/auth/users/user.entity';
import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {Pin} from '../pin/pin.entity';

@Entity()
export class Device {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  name: string;

  @Column()
  active: boolean;

  @OneToMany((type) => User, (type) => type.device, {
    eager: true,
    nullable: true,
  })
  users: User[];

  @OneToMany((type) => Pin, (type) => type.device, { nullable: true })
  pins: Pin[];

  @Column()
  createdAt: string;

  @Column({ nullable: true })
  updatedAt: string;

  @Column({ nullable: true })
  lastConfigurationDate: string;

  @Column({ nullable: true })
  lastSetupDate: string;
}
