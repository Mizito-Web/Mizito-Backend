import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'username@example.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Password@134412' })
  @IsNotEmpty()
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long.' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])[A-Za-z\d\S]{8,}$/,
    {
      message:
        'Password must contain at least one lowercase letter, one uppercase letter, one number and one special character and 8 characters or more.',
    }
  )
  password: string;

  @ApiProperty({ example: 'Bob' })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Wang' })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty({ example: 'k3rn3lpanic' })
  @IsNotEmpty()
  @IsString()
  userName: string;

  @ApiPropertyOptional({ example: 'https://example.com/image.png' })
  @IsString()
  avatar?: string;

  @ApiPropertyOptional({ example: '1234567890' })
  @IsString()
  phone?: string;
}
