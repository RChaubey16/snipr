import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { nanoid } from 'nanoid';
import { Url } from './url.entity';

@Injectable()
export class UrlService {
  constructor(
    @InjectRepository(Url)
    private readonly urlRepository: Repository<Url>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async createShortUrl(longUrl: string): Promise<string> {
    const existingUrl = await this.urlRepository.findOne({
      where: { longUrl },
    });
    if (existingUrl) {
      return existingUrl.shortCode;
    }

    const shortCode = nanoid(6);
    const url = this.urlRepository.create({ longUrl, shortCode });
    await this.urlRepository.save(url);

    // Cache immediately on creation
    await this.cacheManager.set(shortCode, longUrl);

    return shortCode;
  }

  async getLongUrl(shortCode: string): Promise<string> {
    // Check Redis first
    const cached = await this.cacheManager.get<string>(shortCode);
    if (cached) {
      console.log(`Cache hit for ${shortCode}`);
      return cached;
    }

    // Cache miss — fetch from Postgres
    console.log(`Cache miss for ${shortCode}`);
    const url = await this.urlRepository.findOne({ where: { shortCode } });

    if (url) {
      // Store in Redis for next time
      await this.cacheManager.set(shortCode, url.longUrl);
    }

    return url?.longUrl ?? '';
  }

  async incrementClickCount(shortCode: string): Promise<void> {
    await this.urlRepository.increment({ shortCode }, 'clickCount', 1);
  }
}
