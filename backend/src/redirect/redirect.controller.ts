import {
  Controller,
  Get,
  Param,
  Redirect,
  NotFoundException,
} from '@nestjs/common';
import { UrlService } from '../url/url.service';

@Controller()
export class RedirectController {
  constructor(private readonly urlService: UrlService) {}

  @Get(':shortCode')
  @Redirect()
  async redirect(@Param('shortCode') shortCode: string) {
    const longUrl = await this.urlService.getLongUrl(shortCode);

    if (!longUrl) {
      throw new NotFoundException('Short URL not found');
    }

    await this.urlService.incrementClickCount(shortCode);

    return { url: longUrl };
  }
}
