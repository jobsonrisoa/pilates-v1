import { BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { PasswordResetService } from './password-reset.service';
import { PasswordService } from './password.service';
import { PrismaService } from '@/shared/infrastructure/database/prisma.service';
import { MailService } from '@/shared/infrastructure/mail/mail.service';
import { createMockPrismaService } from '../../../../../test/mocks/prisma.mock';

describe('PasswordResetService', () => {
  let service: PasswordResetService;
  let prisma: ReturnType<typeof createMockPrismaService>;
  let jwtService: JwtService;
  let configService: ConfigService;
  let mailService: MailService;
  let passwordService: PasswordService;

  const mockUser = {
    id: 'user-1',
    email: 'user@example.com',
    passwordHash: 'hash',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockResetToken = {
    id: 'token-1',
    token: 'reset-token-jwt',
    userId: 'user-1',
    expiresAt: new Date(Date.now() + 60 * 60 * 1000),
    used: false,
    createdAt: new Date(),
  };

  beforeEach(async () => {
    prisma = createMockPrismaService();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PasswordResetService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('reset-token-jwt'),
            verify: jest.fn().mockReturnValue({ sub: 'user-1', type: 'password-reset' }),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'JWT_RESET_SECRET') return 'reset-secret-min-32-chars-long';
              if (key === 'FRONTEND_URL') return 'http://localhost:3000';
              return undefined;
            }),
          },
        },
        { provide: PrismaService, useValue: prisma },
        {
          provide: MailService,
          useValue: { sendPasswordResetEmail: jest.fn().mockResolvedValue(undefined) },
        },
        {
          provide: PasswordService,
          useValue: { hash: jest.fn().mockResolvedValue('new-hash') },
        },
      ],
    }).compile();

    service = module.get(PasswordResetService);
    jwtService = module.get(JwtService);
    configService = module.get(ConfigService);
    mailService = module.get(MailService);
    passwordService = module.get(PasswordService);
  });

  describe('requestPasswordReset', () => {
    it('should do nothing when user does not exist', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      await service.requestPasswordReset('unknown@example.com');

      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email: 'unknown@example.com' } });
      expect(prisma.passwordResetToken.create).not.toHaveBeenCalled();
      expect(mailService.sendPasswordResetEmail).not.toHaveBeenCalled();
    });

    it('should generate token, store it and send email when user exists', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (prisma.passwordResetToken.create as jest.Mock).mockResolvedValue(mockResetToken);

      await service.requestPasswordReset('user@example.com');

      expect(jwtService.sign).toHaveBeenCalledWith(
        { sub: 'user-1', type: 'password-reset' },
        { secret: 'reset-secret-min-32-chars-long', expiresIn: '1h' },
      );
      expect(prisma.passwordResetToken.create).toHaveBeenCalledWith({
        data: {
          token: 'reset-token-jwt',
          userId: 'user-1',
          expiresAt: expect.any(Date),
        },
      });
      expect(mailService.sendPasswordResetEmail).toHaveBeenCalledWith(
        'user@example.com',
        'http://localhost:3000/reset-password?token=reset-token-jwt',
      );
    });

    it('should throw when JWT_RESET_SECRET is not configured', async () => {
      (configService.get as jest.Mock).mockReturnValue(undefined);
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      await expect(service.requestPasswordReset('user@example.com')).rejects.toThrow(
        'JWT_RESET_SECRET is required but not configured',
      );
    });
  });

  describe('resetPassword', () => {
    it('should throw when token is invalid', async () => {
      (jwtService.verify as jest.Mock).mockImplementation(() => {
        throw new Error('invalid');
      });

      await expect(service.resetPassword('bad-token', 'NewPass123!')).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.resetPassword('bad-token', 'NewPass123!')).rejects.toThrow(
        'Invalid or expired token',
      );
    });

    it('should throw when reset token not found', async () => {
      (prisma.passwordResetToken.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.resetPassword('reset-token-jwt', 'NewPass123!')).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.resetPassword('reset-token-jwt', 'NewPass123!')).rejects.toThrow(
        'Invalid or expired token',
      );
    });

    it('should throw when reset token is already used', async () => {
      (prisma.passwordResetToken.findUnique as jest.Mock).mockResolvedValue({
        ...mockResetToken,
        used: true,
      });

      await expect(service.resetPassword('reset-token-jwt', 'NewPass123!')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should update password and mark token as used', async () => {
      (prisma.passwordResetToken.findUnique as jest.Mock).mockResolvedValue(mockResetToken);
      (prisma.user.update as jest.Mock).mockResolvedValue(mockUser);
      (prisma.passwordResetToken.update as jest.Mock).mockResolvedValue({
        ...mockResetToken,
        used: true,
      });

      await service.resetPassword('reset-token-jwt', 'NewPass123!');

      expect(passwordService.hash).toHaveBeenCalledWith('NewPass123!');
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user-1' },
        data: { passwordHash: 'new-hash' },
      });
      expect(prisma.passwordResetToken.update).toHaveBeenCalledWith({
        where: { token: 'reset-token-jwt' },
        data: { used: true },
      });
    });
  });
});
