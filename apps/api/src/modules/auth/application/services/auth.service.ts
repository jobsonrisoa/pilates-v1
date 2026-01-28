import { Injectable } from '@nestjs/common';
import { Either } from '@/shared/domain/either';
import { LoginUseCase } from '../use-cases/login.use-case';
import { LoginResult } from '../use-cases/login.use-case';
import { RefreshTokenUseCase, RefreshTokenResult } from '../use-cases/refresh-token.use-case';
import { PasswordResetService } from '@/modules/auth/infrastructure/services/password-reset.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly passwordResetService: PasswordResetService,
  ) {}

  async login(email: string, password: string): Promise<Either<Error, LoginResult>> {
    return this.loginUseCase.execute(email, password);
  }

  async refresh(refreshToken: string): Promise<Either<Error, RefreshTokenResult>> {
    return this.refreshTokenUseCase.execute(refreshToken);
  }

  async requestPasswordReset(email: string): Promise<void> {
    await this.passwordResetService.requestPasswordReset(email);
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    await this.passwordResetService.resetPassword(token, newPassword);
  }
}

