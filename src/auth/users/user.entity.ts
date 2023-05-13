import { Device } from 'src/device/device.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  hashedRt: string;

  @Column()
  createdAt: Date;

  @Column({ nullable: true })
  verifiedAt: Date;

  @ManyToOne((type) => Device, (type) => type.users, {
    eager: false,
    nullable: true,
  })
  device: Device;

  //   @Column({ type: 'boolean' })
  //   active: boolean;
  // TODO
  //   @Column({type: 'enum'})
  //   role: string;
}
