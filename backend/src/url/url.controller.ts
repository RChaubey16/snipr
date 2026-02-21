import { Controller, Post, Body } from '@nestjs/common';

@Controller('url')
export class UrlController {
  @Post()
  createUrl(@Body('url') url: string): string {
    return url;
  }
}
