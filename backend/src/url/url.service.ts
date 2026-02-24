import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { nanoid } from 'nanoid';
import { IsNull, Repository } from 'typeorm';
import { Url } from './url.entity';
import type { Cache } from 'cache-manager';

@Injectable()
export class UrlService {
  constructor(
    @InjectRepository(Url)
    private readonly urlRepository: Repository<Url>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  /**
   * Creates a short URL for a given long URL.
   * @param longUrl The long URL to create a short URL for.
   * @returns The short URL for the given long URL.
   */
  async createShortUrl(
    longUrl: string,
    userId: string | null,
  ): Promise<string> {
    const existingUrl = await this.urlRepository.findOne({
      where: { longUrl, userId: userId ?? IsNull() },
    });

    if (existingUrl) {
      return existingUrl.shortCode;
    }

    const shortCode = nanoid(6);
    const url = this.urlRepository.create({ longUrl, shortCode, userId });
    await this.urlRepository.save(url);

    await this.cacheManager.set(shortCode, longUrl);

    return shortCode;
  }

  /**
   * Retrieves the long URL for a given short code.
   * @param shortCode The short code to retrieve the long URL for.
   * @returns The long URL for the given short code.
   */
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
      return url.longUrl;
    }

    throw new NotFoundException('Invalid snipr');
  }

  /**
   * Increments the click count for a given short code.
   * @param shortCode The short code to increment the click count for.
   */
  async incrementClickCount(shortCode: string): Promise<void> {
    await this.urlRepository.increment({ shortCode }, 'clickCount', 1);
  }
}
