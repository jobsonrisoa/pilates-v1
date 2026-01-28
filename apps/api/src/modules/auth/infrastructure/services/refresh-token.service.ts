import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '@/shared/infrastructure/database/prisma.service';
import { JwtService } from './jwt.service';

@Injectable()
export class RefreshTokenService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Generate and persist a new refresh token for a user.
   */
  async generateRefreshToken(userId: string): Promise<string> {
    const prisma = this.prisma as any;
    const payload = await this.buildPayload(userId);

    const token = await this.jwtService.signRefreshToken(payload);

    const decoded = await this.jwtService.verifyRefreshToken(token);

    if (!decoded.exp) {
      throw new Error('Refresh token payload is missing exp claim');
    }

    await prisma.refreshToken.create({
      data: {
        token,
        userId,
        expiresAt: new Date(decoded.exp * 1000),
      },
    });

    return token;
  }

  /**
   * Validate a refresh token and return the associated user id.
   * Throws UnauthorizedException when invalid.
   */
  async validateRefreshToken(token: string): Promise<string> {
    const prisma = this.prisma as any;
    try {
      const decoded = await this.jwtService.verifyRefreshToken(token);

      const storedToken = await prisma.refreshToken.findUnique({
        where: { token },
      });

      if (!storedToken || storedToken.revoked || storedToken.expiresAt < new Date()) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      return decoded.sub;
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async revokeRefreshToken(token: string): Promise<void> {
    const prisma = this.prisma as any;

    await prisma.refreshToken.updateMany({
      where: { token, revoked: false },
      data: { revoked: true },
    });
  }

  async rotateRefreshToken(oldToken: string, userId: string): Promise<string> {
    await this.revokeRefreshToken(oldToken);
    return this.generateRefreshToken(userId);
  }

  private async buildPayload(userId: string) {
    // This service only knows the user id; roles/email are not required for refresh validation.
    // Decode the old token or fetch user roles if needed in future stories.
    return {
      sub: userId,
      email: '',
      roles: [],
    };
  }
}


