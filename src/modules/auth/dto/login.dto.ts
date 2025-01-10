import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Roles } from '../enums/role.enum';

export class LoginUserDto {
  @ApiProperty({ example: 'username@example.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Password@1234' })
  @IsNotEmpty()
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long.' })
  password: string;
}
