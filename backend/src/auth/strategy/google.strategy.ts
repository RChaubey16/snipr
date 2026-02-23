import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-google-oauth20';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private authService: AuthService) {
    super({
      clientID: process.env.GOOGLE_OAUTH_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_OAUTH_CALLBACK_URL!,
      scope: ['email', 'profile'],
    });
  }

  async validate(profile: Profile) {
    const { id, name, emails, photos } = profile;

    return this.authService.findOrCreateUser({
      googleId: id,
      email: emails?.[0]?.value ?? '',
      name: `${name?.givenName ?? ''} ${name?.familyName ?? ''}`.trim(),
      avatar: photos?.[0]?.value ?? '',
    });
  }
}
