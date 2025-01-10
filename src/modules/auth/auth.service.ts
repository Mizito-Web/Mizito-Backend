import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  NotAcceptableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserLoginData } from './interfaces/user-login-data.interface';
import * as argon2 from 'argon2';
import { UsersService } from '../users/users.service';
import { USER } from './constants/user.constants';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private jwtService: JwtService,
    private usersService: UsersService
  ) {}
  public async generateTokens(
    payload: any
  ): Promise<{ access_token: string; refresh_token: string }> {
    let accessExpiresIn = '30d';

    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: accessExpiresIn,
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
        expiresIn: '30d',
      }),
    ]);

    return {
      access_token,
      refresh_token,
    };
  }

  public async hashAndSaveRefreshTokenInUser(
    userId: string,
    refreshToken: string
  ): Promise<void> {
    const hashedRefreshToken = await argon2.hash(refreshToken);
    await this.usersService.updateUserRefreshToken(userId, hashedRefreshToken);
  }

  async login(user: UserLoginData) {
    const payload = {
      email: user.email,
      sub: user._id,
      type: user.type,
      status: user.status,
    };
    const { access_token, refresh_token } = await this.generateTokens(payload);
    await this.hashAndSaveRefreshTokenInUser(user._id, refresh_token);
    return {
      user,
      access_token,
      refresh_token,
    };
  }

  async refreshToken(userId: string, refreshToken: string) {
    const user = await this.usersService.getUserAndRefreshToken(userId);

    if (!user || !user.refreshToken) {
      throw new ForbiddenException();
    }

    const isRefreshTokenValid = await argon2.verify(
      user.refreshToken,
      refreshToken
    );

    if (!isRefreshTokenValid) {
      throw new ForbiddenException();
    }

    const { access_token, refresh_token } = await this.generateTokens({
      email: user.email,
      sub: String(user['_id']),
      type: user.type,
      status: user.status,
    });

    await this.hashAndSaveRefreshTokenInUser(userId, refresh_token);

    return { access_token, refresh_token };
  }

  async validateUser(
    email: string,
    password: string,
    userType: string
  ): Promise<Partial<UserLoginData>> {
    const findQuery = {
      email: email.toLowerCase(),
      type: userType,
    };

    if (userType === 'USER') findQuery['type'] = USER.TYPE.USER;
    else if (userType === 'ADMIN') findQuery['type'] = USER.TYPE.ADMIN;

    const user = await this.usersService.getUserUsedValidateUser(findQuery);

    if (!user) {
      throw new NotAcceptableException('Email or Password is wrong');
    }

    if (
      user &&
      user.registerType === USER.REGISTER_TYPE.NORMAL &&
      !user?.password
    ) {
      throw new NotAcceptableException('Email or Password is wrong');
    }

    if (user?.password) {
      const passwordValid = await bcrypt.compare(password, user.password);
      if (!passwordValid) {
        throw new NotAcceptableException('Email or Password is wrong');
      }
    }

    if (user.type === USER.TYPE.USER && user.status === USER.STATUS.NEW) {
      throw new HttpException(
        'Please verify your email address',
        HttpStatus.UNAUTHORIZED
      );
    }

    delete user.password;

    return user;
  }
}
