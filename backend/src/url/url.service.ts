import { Injectable } from '@nestjs/common';
import { nanoid } from 'nanoid';

@Injectable()
export class UrlService {
  private readonly urlMap = new Map<string, string>();

  createShortUrl(longUrl: string): string {
    const shortCode = nanoid(6);
    this.urlMap.set(shortCode, longUrl);
    console.log(this.urlMap);
    return shortCode;
  }

  getLongUrl(shortCode: string): string | undefined {
    return this.urlMap.get(shortCode);
  }
}
