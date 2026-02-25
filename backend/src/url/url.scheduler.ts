import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Url } from './url.entity';

@Injectable()
export class UrlScheduler {
  constructor(
    @InjectRepository(Url)
    private readonly urlRepository: Repository<Url>,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async resetDailyClicks() {
    await this.urlRepository.update({}, { dailyClickCount: 0 });
  }

  @Cron(CronExpression.EVERY_WEEK)
  async resetWeeklyClicks() {
    await this.urlRepository.update({}, { weeklyClickCount: 0 });
  }
}
