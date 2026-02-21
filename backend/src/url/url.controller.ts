import { Controller, Post, Body } from '@nestjs/common';
import { UrlService } from './url.service';

@Controller('url')
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Post()
  createUrl(@Body('url') url: string) {
    return {
      url_short_code: this.urlService.createShortUrl(url),
    };
  }
}
