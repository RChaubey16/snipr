import { Controller, Post, Body, Get } from '@nestjs/common';
import { UrlService } from './url.service';
import { SniprDto, UrlDto } from './dto/url.dto';

@Controller('url')
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Post()
  async createUrl(@Body() urlDto: UrlDto): Promise<string> {
    return this.urlService.createShortUrl(urlDto.url);
  }

  @Get()
  async getLongUrl(@Body() sniprDto: SniprDto): Promise<string> {
    console.log(sniprDto.shortUrl);
    if (!sniprDto.shortUrl) {
      throw new Error('Short URL is required');
    }

    return this.urlService.getLongUrl(sniprDto.shortUrl);
  }
}
