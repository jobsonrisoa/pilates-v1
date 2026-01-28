import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Either, left, right } from '@/shared/domain/either';
import { UserRepository } from '@/modules/auth/domain/repositories/user.repository';
import { JwtService, JwtPayload } from '@/modules/auth/infrastructure/services/jwt.service';
import { RefreshTokenService } from '@/modules/auth/infrastructure/services/refresh-token.service';

export interface RefreshTokenResult {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    roles: string[];
  };
}

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  async execute(refreshToken: string): Promise<Either<Error, RefreshTokenResult>> {
    try {
      const userId = await this.refreshTokenService.validateRefreshToken(refreshToken);

      const user = await this.userRepository.findById(userId);

      if (!user || !user.isActive) {
        return left(new UnauthorizedException('Invalid refresh token'));
      }

      const payload: JwtPayload = {
        sub: user.id,
        email: user.email,
        roles: user.getRoleNames(),
      };

      const [accessToken, newRefreshToken] = await Promise.all([
        this.jwtService.signAccessToken(payload),
        this.refreshTokenService.rotateRefreshToken(refreshToken, user.id),
      ]);

      return right({
        accessToken,
        refreshToken: newRefreshToken,
        user: {
          id: user.id,
          email: user.email,
          roles: user.getRoleNames(),
        },
      });
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        return left(error);
      }

      return left(new UnauthorizedException('Invalid refresh token'));
    }
  }
}


