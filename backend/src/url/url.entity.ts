import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Url {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  longUrl!: string;

  @Column({ unique: true })
  shortCode!: string;

  @Column({ default: 0 })
  clickCount!: number;

  @CreateDateColumn()
  createdAt!: Date;
}
