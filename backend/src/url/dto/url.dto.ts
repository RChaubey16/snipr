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

export class UrlResponseDto {
  id: string;
  shortUrl: string;
  originalUrl: string;
  clicks: number;
  createdAt: string;
  status: 'active' | 'expired';
}
