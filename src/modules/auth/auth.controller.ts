import {
  Body,
  Controller,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { LoginUserDto } from './dto/login.dto';
import { Request as ExpressRequest, Response } from 'express';
import { UserLoginData } from './interfaces/user-login-data.interface';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtRefreshGuard } from './guards/jwt.refresh.guard';
import { JwtAuthGuard } from './guards/jwt.guard';
import { User } from '../users/model/user.model';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Register' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    status: 200,
    description: 'Register using an email and password',
    type: User,
  })
  @Post('/register')
  async createUser(@Body() body: RegisterDto) {
    return await this.authService.register(body);
  }

  @ApiOperation({ summary: 'Login using basic credentials' })
  @ApiBody({ type: LoginUserDto })
  @ApiResponse({ status: 200, description: 'Return a JWT Token' })
  @UseGuards(LocalAuthGuard)
  @Post('/login/basic')
  async login(@Body() req: UserLoginData) {
    return this.authService.login(req);
  }

  @ApiResponse({ status: 200 })
  @ApiOperation({ summary: 'Get new refresh and access token' })
  @ApiBearerAuth()
  @UseGuards(JwtRefreshGuard)
  @Post('/refresh-token')
  async refreshToken(@Body() req: { sub: any; refreshToken: string }) {
    return this.authService.refreshToken(req.sub, req.refreshToken);
  }

  @ApiResponse({ status: 200 })
  @ApiOperation({ summary: 'Logout' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('/logout')
  async logout(@Request() req: any) {
    return this.authService.logout(req.user.sub);
  }
}
