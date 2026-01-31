import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from '@/modules/auth/application/services/auth.service';
import { UnauthorizedException } from '@nestjs/common';
import { left, right } from '@/shared/domain/either';
import type { Response } from 'express';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: jest.Mocked<AuthService>;

  beforeEach(async () => {
    authService = {
      login: jest.fn(),
      refresh: jest.fn(),
      requestPasswordReset: jest.fn(),
      resetPassword: jest.fn(),
      getUserPermissions: jest.fn().mockResolvedValue([]),
    } as unknown as jest.Mocked<AuthService>;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: authService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  describe('login', () => {
    it('should return access token and user on successful login', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'Password123!',
      };

      const loginResult = {
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        user: {
          id: 'user-id',
          email: 'test@example.com',
          roles: ['ADMIN'],
        },
      };

      authService.login.mockResolvedValue(right(loginResult));

      const mockResponse = {
        cookie: jest.fn(),
      } as unknown as Response;

      authService.getUserPermissions.mockResolvedValue(['users:read']);
      const result = await controller.login(loginDto, mockResponse);

      expect(result.accessToken).toBe('access-token');
      expect(result.user).toEqual({ ...loginResult.user, permissions: ['users:read'] });
      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'refreshToken',
        'refresh-token',
        expect.objectContaining({
          httpOnly: true,
          secure: expect.any(Boolean),
          sameSite: 'strict',
          maxAge: 7 * 24 * 60 * 60 * 1000,
          path: '/',
        }),
      );
    });

    it('should set secure cookie in production environment', async () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      const loginDto = {
        email: 'test@example.com',
        password: 'Password123!',
      };

      const loginResult = {
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        user: {
          id: 'user-id',
          email: 'test@example.com',
          roles: ['ADMIN'],
        },
      };

      authService.login.mockResolvedValue(right(loginResult));

      const mockResponse = {
        cookie: jest.fn(),
      } as unknown as Response;

      await controller.login(loginDto, mockResponse);

      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'refreshToken',
        'refresh-token',
        expect.objectContaining({
          secure: true,
        }),
      );

      process.env.NODE_ENV = originalEnv;
    });

    it('should throw UnauthorizedException on invalid credentials', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'WrongPassword123!',
      };

      const error = new UnauthorizedException('Invalid credentials');
      authService.login.mockResolvedValue(left(error));

      const mockResponse = {
        cookie: jest.fn(),
      } as unknown as Response;

      await expect(controller.login(loginDto, mockResponse)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(mockResponse.cookie).not.toHaveBeenCalled();
    });

    it('should throw HttpException when error is not HttpException', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'Password123!',
      };

      const error = new Error('Generic error');
      authService.login.mockResolvedValue(left(error));

      const mockResponse = {
        cookie: jest.fn(),
      } as unknown as Response;

      await expect(controller.login(loginDto, mockResponse)).rejects.toThrow(
        HttpException,
      );
      expect(mockResponse.cookie).not.toHaveBeenCalled();
    });
  });

  describe('forgotPassword', () => {
    it('should return success message without revealing if email exists', async () => {
      authService.requestPasswordReset.mockResolvedValue(undefined);

      const dto = { email: 'user@example.com' };
      const result = await controller.forgotPassword(dto);

      expect(result).toEqual({
        message: 'If the email exists, a reset link has been sent',
      });
      expect(authService.requestPasswordReset).toHaveBeenCalledWith('user@example.com');
    });
  });

  describe('resetPassword', () => {
    it('should return success message on valid token and password', async () => {
      authService.resetPassword.mockResolvedValue(undefined);

      const dto = { token: 'valid-reset-token', password: 'NewPass123!' };
      const result = await controller.resetPassword(dto);

      expect(result).toEqual({ message: 'Password reset successfully' });
      expect(authService.resetPassword).toHaveBeenCalledWith('valid-reset-token', 'NewPass123!');
    });
  });
});

