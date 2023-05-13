import { User } from 'src/auth/users/user.entity';
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Device {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  address: string;

  @Column()
  active: boolean;

  @OneToMany((type) => User, (type) => type.device, {
    eager: true,
    nullable: true,
  })
  users: User[];
}
