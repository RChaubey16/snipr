import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';

import { createKeyv } from '@keyv/redis';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { User } from './auth/user.entity';
import { RedirectModule } from './redirect/redirect.module';
import { Click, Url } from './url/url.entity';
import { UrlModule } from './url/url.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get('DB_USER'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB_NAME'),
        entities: [Url, User, Click],
        migrations: ['dist/migrations/*.js'],
        migrationsRun: true,
        synchronize: false,
      }),
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        stores: [
          createKeyv(
            `redis://${config.get('REDIS_HOST')}:${config.get('REDIS_PORT')}`,
          ),
        ],
      }),
    }),
    ScheduleModule.forRoot(),
    UrlModule,
    AuthModule,
    RedirectModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
