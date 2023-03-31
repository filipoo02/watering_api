import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

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

  //   @Column({ type: 'boolean' })
  //   active: boolean;
  // TODO
  //   @Column({type: 'enum'})
  //   role: string;
}
