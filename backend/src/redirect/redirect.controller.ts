import { Controller, Get, Param, Redirect } from '@nestjs/common';
import { UrlService } from '../url/url.service';

@Controller()
export class RedirectController {
  constructor(private readonly urlService: UrlService) {}

  @Get(':shortCode')
  @Redirect()
  async redirect(@Param('shortCode') shortCode: string) {
    const longUrl = await this.urlService.getLongUrl(shortCode);
    await this.urlService.incrementClickCount(shortCode);

    return { url: longUrl };
  }
}
