import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';

import type { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { OptionalJwtGuard } from 'src/auth/guards/optional-jwt.guard';
import { User } from 'src/auth/user.entity';

import {
  PaginatedUrlResponseDto,
  SniprDto,
  UrlDto,
  UserStatsDto,
} from './dto/url.dto';
import { UrlService } from './url.service';

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

  @Get('my-urls')
  @UseGuards(JwtAuthGuard)
  async getMyUrls(
    @Req() req: Request,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ): Promise<PaginatedUrlResponseDto> {
    return this.urlService.getUrlsByUser(
      req.user as User,
      Number(page),
      Number(limit),
    );
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard)
  async getStats(@Req() req: Request): Promise<UserStatsDto> {
    return this.urlService.getUserStats(req.user as User);
  }

  @Get()
  async getLongUrl(@Body() sniprDto: SniprDto): Promise<string> {
    const { shortUrl } = sniprDto;
    return this.urlService.getLongUrl(shortUrl);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteUrl(
    @Param('id') id: string,
    @Req() req: Request,
  ): Promise<{ message: string }> {
    await this.urlService.deleteUrl(Number(id), (req.user as User).id);
    return { message: 'URL deleted successfully' };
  }
}
