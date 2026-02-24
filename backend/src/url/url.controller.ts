import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { UrlService } from './url.service';
import { SniprDto, UrlDto } from './dto/url.dto';
import { OptionalJwtGuard } from 'src/auth/guards/optional-jwt.guard';
import { User } from 'src/auth/user.entity';
import type { Request } from 'express';

@Controller('url')
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @UseGuards(OptionalJwtGuard)
  @Post()
  async createUrl(
    @Body() urlDto: UrlDto,
    @Req() req: Request,
  ): Promise<{ shortUrl: string }> {
    const { url } = urlDto;
    const userId = (req.user as User)?.id ?? null;

    return {
      shortUrl: await this.urlService.createShortUrl(url, userId),
    };
  }

  @Get()
  async getLongUrl(@Body() sniprDto: SniprDto): Promise<string> {
    const { shortUrl } = sniprDto;
    return this.urlService.getLongUrl(shortUrl);
  }
}
