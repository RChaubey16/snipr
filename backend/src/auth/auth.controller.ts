import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import type { Cache } from 'cache-manager';
import type { Request, Response } from 'express';
import crypto from 'node:crypto';

import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { User } from './user.entity';

interface RequestWithUser extends Request {
  user: User;
}

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleLogin() {} // Redirects to Google

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req: RequestWithUser, @Res() res: Response) {
    const token = this.authService.generateToken(req.user);
    const code = crypto.randomUUID();

    // Store token in Redis for 30 seconds only
    await this.cacheManager.set(`auth_code:${code}`, token, 30000);

    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?code=${code}`);
  }
  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMe(@Req() req: RequestWithUser) {
    return req.user;
  }

  @Post('logout')
  logout(@Res() res: Response) {
    res.clearCookie('auth_token', {
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    });
    res.json({ success: true, message: 'Logged out' });
  }

  @Post('exchange')
  async exchangeCode(@Body('code') code: string, @Res() res: Response) {
    const token = await this.cacheManager.get<string>(`auth_code:${code}`);

    if (!token) {
      return res.status(400).json({ error: 'Invalid or expired code' });
    }

    // Delete immediately after use — one time only
    await this.cacheManager.del(`auth_code:${code}`);

    return res.json({ token });
  }
}
