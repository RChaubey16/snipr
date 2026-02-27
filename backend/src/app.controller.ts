import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  async checkHealth() {
    const health = await this.appService.checkHealth();

    if (health.status === 'degraded') {
      throw new HttpException(health, HttpStatus.SERVICE_UNAVAILABLE);
    }

    return health;
  }
}
