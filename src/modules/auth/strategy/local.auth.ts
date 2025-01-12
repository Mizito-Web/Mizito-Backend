import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { Request as ExpressRequest } from 'express';
import { UserLoginData } from '../interfaces/user-login-data.interface';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
    });
  }

  async validate(
    req: ExpressRequest,
    email: string,
    password: string
  ): Promise<Partial<UserLoginData>> {
    return this.authService.validateUser(email, password);
  }
}
