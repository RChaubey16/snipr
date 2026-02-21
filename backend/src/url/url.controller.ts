import { Controller, Post, Body } from '@nestjs/common';
import { UrlService } from './url.service';

@Controller('url')
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Post()
  async createUrl(@Body('url') url: string): Promise<string> {
    return this.urlService.createShortUrl(url);
  }
}
