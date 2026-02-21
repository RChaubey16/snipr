import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UrlModule } from './url/url.module';
import { Url } from './url/url.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedirectModule } from './redirect/redirect.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USER'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),
        entities: [Url],
        synchronize: true, // auto-creates tables in dev, never use in production
      }),
    }),
    UrlModule,
    RedirectModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
