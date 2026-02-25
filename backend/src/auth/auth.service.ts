import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { User } from './user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  /**
   * Find or create a user
   * @param profile User profile
   * @returns User
   */
  async findOrCreateUser(profile: Partial<User>): Promise<User> {
    let user = await this.userRepo.findOne({ where: { email: profile.email } });

    if (!user) {
      user = this.userRepo.create(profile);
      await this.userRepo.save(user);
    }

    return user;
  }

  /**
   * Generate a JWT token
   * @param user User
   * @returns JWT token
   */
  generateToken(user: User): string {
    return this.jwtService.sign({ sub: user.id, email: user.email });
  }
}
