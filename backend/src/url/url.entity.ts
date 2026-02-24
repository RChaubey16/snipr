import { User } from 'src/auth/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
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

  @Column({
    type: 'timestamp',
    default: () => "NOW() + INTERVAL '30 days'",
  })
  expiresAt!: Date;

  @ManyToOne(() => User, { nullable: true, eager: false })
  @JoinColumn({ name: 'userId' })
  user!: User | null;

  @Column({ nullable: true })
  userId!: string | null;
}
