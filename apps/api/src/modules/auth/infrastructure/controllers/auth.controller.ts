import {
  Controller,
  Post,
  Body,
  Res,
  HttpCode,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { Response } from 'express';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LoginDto } from '@/modules/auth/application/dto/login.dto';
import { LoginResponseDto } from '@/modules/auth/application/dto/login-response.dto';
import { AuthService } from '@/modules/auth/application/services/auth.service';
import { isHttpException } from '@/shared/utils/type-guards';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @Throttle({ limit: 5, ttl: 60000 }) // 5 requests per minute
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, type: LoginResponseDto, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiResponse({ status: 429, description: 'Too many requests' })
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response): Promise<LoginResponseDto> {
    const result = await this.authService.login(loginDto.email, loginDto.password);

    if (result.isLeft()) {
      throw isHttpException(result.value)
        ? result.value
        : new HttpException(result.value.message, HttpStatus.UNAUTHORIZED);
    }

    const { accessToken, refreshToken, user } = result.value;

    // Set refresh token in httpOnly cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/',
    });

    return {
      accessToken,
      user,
    };
  }
}

