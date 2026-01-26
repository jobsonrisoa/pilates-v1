import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

export interface JwtPayload {
  sub: string; // user id
  email: string;
  roles: string[];
}

@Injectable()
export class JwtService {
  constructor(
    private readonly jwtService: NestJwtService,
    private readonly configService: ConfigService,
  ) {}

  async signAccessToken(payload: JwtPayload): Promise<string> {
    return this.jwtService.signAsync(payload, {
      expiresIn: '15m',
    });
  }

  async signRefreshToken(payload: JwtPayload): Promise<string> {
    const refreshSecret =
      this.configService.get<string>('JWT_REFRESH_SECRET') || this.configService.get<string>('JWT_SECRET');
    if (!refreshSecret) {
      throw new Error('JWT_SECRET or JWT_REFRESH_SECRET is required but not configured');
    }
    return this.jwtService.signAsync(payload, {
      expiresIn: '7d',
      secret: refreshSecret,
    });
  }

  async verify(token: string): Promise<JwtPayload> {
    return this.jwtService.verifyAsync<JwtPayload>(token);
  }

  async verifyRefreshToken(token: string): Promise<JwtPayload> {
    const refreshSecret =
      this.configService.get<string>('JWT_REFRESH_SECRET') || this.configService.get<string>('JWT_SECRET');
    if (!refreshSecret) {
      throw new Error('JWT_SECRET or JWT_REFRESH_SECRET is required but not configured');
    }
    return this.jwtService.verifyAsync<JwtPayload>(token, {
      secret: refreshSecret,
    });
  }
}

