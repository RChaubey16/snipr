import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { nanoid } from 'nanoid';
import { Url } from './url.entity';

@Injectable()
export class UrlService {
  constructor(
    @InjectRepository(Url)
    private readonly urlRepository: Repository<Url>,
  ) {}

  async createShortUrl(longUrl: string): Promise<string> {
    const shortCode = nanoid(6);
    const url = this.urlRepository.create({ longUrl, shortCode });
    await this.urlRepository.save(url);
    return shortCode;
  }

  async getLongUrl(shortCode: string): Promise<string> {
    const url = await this.urlRepository.findOne({ where: { shortCode } });

    if (!url) {
      return 'Invalid URL';
    }

    return url?.longUrl || '';
  }

  async incrementClickCount(shortCode: string): Promise<void> {
    await this.urlRepository.increment({ shortCode }, 'clickCount', 1);
  }
}
