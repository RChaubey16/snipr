import { IsString } from 'class-validator';

export class UrlDto {
  @IsString()
  url: string;
}

export class SniprDto {
  @IsString()
  shortUrl: string;
}
