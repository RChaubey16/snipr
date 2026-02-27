import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';

import type { Cache } from 'cache-manager';
import { DataSource } from 'typeorm';

interface CheckResult {
  status: 'up' | 'down';
  error?: string;
}

export interface HealthResult {
  status: 'ok' | 'degraded';
  uptime: number;
  checks: {
    database: CheckResult;
    redis: CheckResult;
  };
}

@Injectable()
export class AppService {
  constructor(
    private readonly dataSource: DataSource,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  /**
   * Checks the health of the application.
   * @returns HealthResult
   */
  async checkHealth(): Promise<HealthResult> {
    const [database, redis] = await Promise.all([
      this.checkDatabase(),
      this.checkRedis(),
    ]);

    const allUp = database.status === 'up' && redis.status === 'up';

    return {
      status: allUp ? 'ok' : 'degraded',
      uptime: process.uptime(),
      checks: { database, redis },
    };
  }

  /**
   * Checks the health of the database.
   * @returns CheckResult
   */
  private async checkDatabase(): Promise<CheckResult> {
    try {
      await this.dataSource.query('SELECT 1');
      return { status: 'up' };
    } catch (error) {
      return { status: 'down', error: this.getErrorMessage(error) };
    }
  }

  /**
   * Checks the health of the Redis.
   * @returns CheckResult
   */
  private async checkRedis(): Promise<CheckResult> {
    const key = '__health_check__';
    try {
      await this.cacheManager.set(key, 'ok', 5000);
      const value = await this.cacheManager.get(key);
      await this.cacheManager.del(key);
      if (value !== 'ok') {
        return { status: 'down', error: 'Unexpected value from Redis' };
      }
      return { status: 'up' };
    } catch (error) {
      return { status: 'down', error: this.getErrorMessage(error) };
    }
  }

  /**
   * Gets the error message from an error.
   * @param error The error to get the message from.
   * @returns The error message.
   */
  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) return error.message;
    return String(error);
  }
}
