import { Controller, UseGuards, Get, Req, Res, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import type { Request, Response } from 'express';
import { User } from './user.entity';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

interface RequestWithUser extends Request {
  user: User;
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleLogin() {} // Redirects to Google

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleCallback(@Req() req: RequestWithUser, @Res() res: Response) {
    const token = this.authService.generateToken(req.user);

    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMe(@Req() req: RequestWithUser) {
    return req.user;
  }

  @Post('logout')
  logout(@Res() res: Response) {
    res.clearCookie('auth_token');
    res.json({ message: 'Logged out' });
  }
}
