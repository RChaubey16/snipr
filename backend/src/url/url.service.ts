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

  async getLongUrl(shortCode: string): Promise<string | undefined> {
    const url = await this.urlRepository.findOne({ where: { shortCode } });
    return url?.longUrl;
  }
}
