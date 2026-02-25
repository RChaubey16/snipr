import { User } from 'src/auth/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
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

  @OneToMany(() => Click, (click) => click.url)
  clicks!: Click[];

  @Column({ default: 0 })
  dailyClickCount!: number;

  @Column({ default: 0 })
  weeklyClickCount!: number;
}

@Entity()
export class Click {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Url, (url) => url.clicks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'urlId' })
  url!: Url;

  @Column()
  urlId!: number;

  @CreateDateColumn()
  createdAt!: Date;
}
