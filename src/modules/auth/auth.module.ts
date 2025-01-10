import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.auth';
import { LocalStrategy } from './strategy/local.auth';
import { UsersService } from '../users/users.service';
import { JwtRefreshTokenStrategy } from './strategy/jwt.refresh.token.strategy';

@Module({
  imports: [
    PassportModule.register({ session: true }),
    PassportModule,
    ConfigModule.forRoot(),
    JwtModule.register({}),
    forwardRef(() => UsersModule),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, JwtRefreshTokenStrategy],
})
export class AuthModule {}
