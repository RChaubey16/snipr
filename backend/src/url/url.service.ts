import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { nanoid } from 'nanoid';
import { IsNull, Repository } from 'typeorm';
import { Click, Url } from './url.entity';
import type { Cache } from 'cache-manager';
import { User } from 'src/auth/user.entity';
import { PaginatedUrlResponseDto, UserStatsDto } from './dto/url.dto';

@Injectable()
export class UrlService {
  constructor(
    @InjectRepository(Url)
    private readonly urlRepository: Repository<Url>,
    @InjectRepository(Click) private clickRepository: Repository<Click>,
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
   * @param page The page number to retrieve.
   * @param limit The number of URLs to retrieve per page.
   * @returns An array of PaginatedUrlResponseDto objects.
   */
  async getUrlsByUser(
    user: User,
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginatedUrlResponseDto> {
    const [urls, total] = await this.urlRepository.findAndCount({
      where: { userId: user.id },
      order: { createdAt: 'DESC' },
      take: limit,
      skip: (page - 1) * limit,
    });

    return {
      data: urls.map((url) => ({
        id: url.id.toString(),
        shortUrl: `${process.env.FRONTEND_URL}/${url.shortCode}`,
        originalUrl: url.longUrl,
        clicks: url.clickCount,
        createdAt: url.createdAt.toISOString().split('T')[0], // "2026-02-20"
        status: url.expiresAt > new Date() ? 'active' : 'expired',
      })),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Retrieves statistics for a specific user.
   * @param user The user to retrieve statistics for.
   * @returns A UserStatsDto object.
   */
  async getUserStats(user: User): Promise<UserStatsDto> {
    const urls = await this.urlRepository.find({
      where: { userId: user.id },
    });

    if (urls.length === 0) {
      return {
        totalLinks: 0,
        totalClicks: 0,
        topLink: null,
        clicksThisWeek: 0,
        clicksToday: 0,
      };
    }

    const totalLinks = urls.length;

    // Total clicks (sum of all click counts across every URL)
    const totalClicks = urls.reduce((sum, url) => sum + url.clickCount, 0);

    // Top link (the URL with the highest individual click count)
    const topLink = urls.reduce((prev, curr) =>
      curr.clickCount > prev.clickCount ? curr : prev,
    );

    const clicksToday = urls.reduce((sum, url) => sum + url.dailyClickCount, 0);
    const clicksThisWeek = urls.reduce(
      (sum, url) => sum + url.weeklyClickCount,
      0,
    );

    return {
      totalLinks,
      totalClicks,
      topLink: {
        shortUrl: `${process.env.FRONTEND_URL}/${topLink.shortCode}`,
        originalUrl: topLink.longUrl,
        clicks: topLink.clickCount,
      },
      clicksThisWeek,
      clicksToday,
    };
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
    const url = await this.urlRepository.findOne({ where: { shortCode } });
    if (!url) return;

    await Promise.all([
      this.urlRepository.increment({ shortCode }, 'clickCount', 1),
      this.urlRepository.increment({ shortCode }, 'dailyClickCount', 1),
      this.urlRepository.increment({ shortCode }, 'weeklyClickCount', 1),
      this.clickRepository.save({ urlId: url.id }),
    ]);
  }
}
