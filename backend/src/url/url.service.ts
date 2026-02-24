import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { nanoid } from 'nanoid';
import { IsNull, Repository } from 'typeorm';
import { Url } from './url.entity';
import type { Cache } from 'cache-manager';
import { User } from 'src/auth/user.entity';
import { UrlResponseDto } from './dto/url.dto';

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
   * Retrieves all URLs created by a specific user.
   * @param user The user to retrieve URLs for.
   * @returns An array of URLResponseDto objects.
   */
  async getUrlsByUser(user: User): Promise<UrlResponseDto[]> {
    const urls = await this.urlRepository.find({
      where: { userId: user.id },
      order: { createdAt: 'DESC' },
    });

    return urls.map((url) => ({
      id: url.id.toString(),
      shortUrl: `${process.env.FRONTEND_URL}/${url.shortCode}`,
      originalUrl: url.longUrl,
      clicks: url.clickCount,
      createdAt: url.createdAt.toISOString().split('T')[0], // "2026-02-20"
      status: url.expiresAt > new Date() ? 'active' : 'expired',
    }));
  }

  /**
   * Deletes a URL created by a specific user.
   * @param id The ID of the URL to delete.
   * @param userId The ID of the user to delete the URL for.
   */
  async deleteUrl(id: number, userId: string): Promise<void> {
    const url = await this.urlRepository.findOne({
      where: { id, userId },
    });

    if (!url) {
      throw new NotFoundException('URL not found');
    }

    await this.urlRepository.remove(url);
    await this.cacheManager.del(url.shortCode);
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
