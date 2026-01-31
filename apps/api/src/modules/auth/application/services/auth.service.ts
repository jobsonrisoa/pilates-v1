import { Injectable } from '@nestjs/common';
import { Either } from '@/shared/domain/either';
import { LoginUseCase } from '../use-cases/login.use-case';
import { LoginResult } from '../use-cases/login.use-case';
import { RefreshTokenUseCase, RefreshTokenResult } from '../use-cases/refresh-token.use-case';
import { PasswordResetService } from '@/modules/auth/infrastructure/services/password-reset.service';
import { PrismaService } from '@/shared/infrastructure/database/prisma.service';
import { formatPermission } from '@/modules/auth/domain/permissions';

@Injectable()
export class AuthService {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly passwordResetService: PasswordResetService,
    private readonly prisma: PrismaService,
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

  /**
   * Returns permission strings (resource:action) for the user.
   * Used by PermissionsGuard and for login/refresh response.
   */
  async getUserPermissions(userId: string): Promise<string[]> {
    const userRoles = await this.prisma.userRole.findMany({
      where: { userId },
      include: {
        role: {
          include: {
            permissions: {
              include: { permission: true },
            },
          },
        },
      },
    });

    const permissionsSet = new Set<string>();
    for (const userRole of userRoles) {
      for (const rp of userRole.role.permissions) {
        permissionsSet.add(
          formatPermission(rp.permission.resource, rp.permission.action),
        );
      }
    }
    return Array.from(permissionsSet);
  }
}

