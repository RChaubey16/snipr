import { Injectable } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';

@Injectable()
export class OptionalJwtGuard extends JwtAuthGuard {
  handleRequest<TUser = any>(
    err: Error | null,
    user: TUser | false,
  ): TUser | null {
    return user || null;
  }
}
