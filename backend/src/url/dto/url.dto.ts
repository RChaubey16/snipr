import { IsNotEmpty, IsString } from 'class-validator';

export class UrlDto {
  @IsString()
  @IsNotEmpty()
  url: string;
}

export class SniprDto {
  @IsString()
  @IsNotEmpty()
  shortUrl: string;
}
