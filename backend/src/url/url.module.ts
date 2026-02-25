import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UrlController } from './url.controller';
import { Click, Url } from './url.entity';
import { UrlScheduler } from './url.scheduler';
import { UrlService } from './url.service';

@Module({
  imports: [TypeOrmModule.forFeature([Url, Click])],
  controllers: [UrlController],
  providers: [UrlService, UrlScheduler],
  exports: [UrlService],
})
export class UrlModule {}
