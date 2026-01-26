import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Either, left, right } from '@/shared/domain/either';
import { UserRepository } from '@/modules/auth/domain/repositories/user.repository';
import { PasswordService } from '@/modules/auth/infrastructure/services/password.service';
import { JwtService, JwtPayload } from '@/modules/auth/infrastructure/services/jwt.service';

export interface LoginResult {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    roles: string[];
  };
}

@Injectable()
export class LoginUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService,
  ) {}

  async execute(email: string, password: string): Promise<Either<Error, LoginResult>> {
    const user = await this.userRepository.findByEmail(email);

    if (!user || !user.isActive) {
      return left(new UnauthorizedException('Invalid credentials'));
    }

    const isPasswordValid = await this.passwordService.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return left(new UnauthorizedException('Invalid credentials'));
    }

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      roles: user.getRoleNames(),
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAccessToken(payload),
      this.jwtService.signRefreshToken(payload),
    ]);

    return right({
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        roles: user.getRoleNames(),
      },
    });
  }
}

