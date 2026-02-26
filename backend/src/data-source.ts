import { config } from 'dotenv';
import { resolve } from 'path';
import 'reflect-metadata';
import { User } from 'src/auth/user.entity';
import { Click, Url } from 'src/url/url.entity';
import { DataSource } from 'typeorm';

// Load backend/.env first (local overrides), then root .env as fallback.
// dotenv won't overwrite vars already set by the first call.
config({ path: resolve(__dirname, '..', '.env') });
config({ path: resolve(__dirname, '..', '..', '.env') });

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT ?? '5432', 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [Url, User, Click],
  migrations: ['src/migrations/*.ts'],
});
