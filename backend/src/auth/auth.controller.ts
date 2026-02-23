import { Controller, UseGuards, Get, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import type { Request, Response } from 'express';
import { User } from './user.entity';

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
    // Redirect to frontend with token
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
  }
}
