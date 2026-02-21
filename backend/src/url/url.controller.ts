import { Controller, Post, Body, Get } from '@nestjs/common';
import { UrlService } from './url.service';

@Controller('url')
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Post()
  async createUrl(@Body('url') url: string): Promise<string> {
    return this.urlService.createShortUrl(url);
  }

  @Get()
  async getLongUrl(@Body('short_url') shortUrl: string): Promise<string> {
    console.log(shortUrl);
    if (!shortUrl) {
      throw new Error('Short URL is required');
    }

    return this.urlService.getLongUrl(shortUrl);
  }
}
