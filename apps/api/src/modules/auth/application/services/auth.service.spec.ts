import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { LoginUseCase } from '../use-cases/login.use-case';
import { RefreshTokenUseCase } from '../use-cases/refresh-token.use-case';
import { PasswordResetService } from '@/modules/auth/infrastructure/services/password-reset.service';
import { PrismaService } from '@/shared/infrastructure/database/prisma.service';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: { userRole: { findMany: jest.Mock } };

  beforeEach(async () => {
    prisma = {
      userRole: {
        findMany: jest.fn().mockResolvedValue([
          {
            role: {
              permissions: [
                { permission: { resource: 'users', action: 'read' } },
                { permission: { resource: 'users', action: 'create' } },
              ],
            },
          },
        ]),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: LoginUseCase, useValue: { execute: jest.fn() } },
        { provide: RefreshTokenUseCase, useValue: { execute: jest.fn() } },
        { provide: PasswordResetService, useValue: { requestPasswordReset: jest.fn(), resetPassword: jest.fn() } },
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  describe('getUserPermissions', () => {
    it('should return formatted permissions for user', async () => {
      const result = await service.getUserPermissions('user-1');

      expect(prisma.userRole.findMany).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
        include: {
          role: {
            include: {
              permissions: { include: { permission: true } },
            },
          },
        },
      });
      expect(result).toEqual(expect.arrayContaining(['users:read', 'users:create']));
      expect(result).toHaveLength(2);
    });

    it('should return empty array when user has no roles', async () => {
      prisma.userRole.findMany.mockResolvedValue([]);

      const result = await service.getUserPermissions('user-2');

      expect(result).toEqual([]);
    });
  });
});
