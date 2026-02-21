import { Controller, Post, Body, Get } from '@nestjs/common';
import { UrlService } from './url.service';
import { SniprDto, UrlDto } from './dto/url.dto';

@Controller('url')
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Post()
  async createUrl(@Body() urlDto: UrlDto): Promise<string> {
    const { url } = urlDto;
    return this.urlService.createShortUrl(url);
  }

  @Get()
  async getLongUrl(@Body() sniprDto: SniprDto): Promise<string> {
    const { shortUrl } = sniprDto;
    return this.urlService.getLongUrl(shortUrl);
  }
}
