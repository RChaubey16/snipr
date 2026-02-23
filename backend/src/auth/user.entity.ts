import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ nullable: true })
  googleId!: string;

  @Column({ nullable: true })
  name!: string;

  @Column({ nullable: true })
  avatar!: string;
}
