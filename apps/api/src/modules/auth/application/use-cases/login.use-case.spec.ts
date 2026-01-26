import { UnauthorizedException } from '@nestjs/common';
import { LoginUseCase } from './login.use-case';
import { UserRepository } from '@/modules/auth/domain/repositories/user.repository';
import { PasswordService } from '@/modules/auth/infrastructure/services/password.service';
import { JwtService } from '@/modules/auth/infrastructure/services/jwt.service';
import { User } from '@/modules/auth/domain/entities/user.entity';

describe('LoginUseCase', () => {
  let loginUseCase: LoginUseCase;
  let userRepository: jest.Mocked<UserRepository>;
  let passwordService: jest.Mocked<PasswordService>;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(() => {
    userRepository = {
      findByEmail: jest.fn(),
      findById: jest.fn(),
    } as unknown as jest.Mocked<UserRepository>;

    passwordService = {
      hash: jest.fn(),
      compare: jest.fn(),
    } as unknown as jest.Mocked<PasswordService>;

    jwtService = {
      signAccessToken: jest.fn(),
      signRefreshToken: jest.fn(),
      verify: jest.fn(),
      verifyRefreshToken: jest.fn(),
    } as unknown as jest.Mocked<JwtService>;

    loginUseCase = new LoginUseCase(userRepository, passwordService, jwtService);
  });

  it('should login successfully with valid credentials', async () => {
    const user = User.create({
      id: 'user-id',
      email: 'test@example.com',
      passwordHash: 'hashed-password',
      isActive: true,
      roles: [
        {
          id: 'role-id',
          role: {
            id: 'role-id',
            name: 'ADMIN',
            description: 'Administrator',
          },
        },
      ],
    });

    userRepository.findByEmail.mockResolvedValue(user);
    passwordService.compare.mockResolvedValue(true);
    jwtService.signAccessToken.mockResolvedValue('access-token');
    jwtService.signRefreshToken.mockResolvedValue('refresh-token');

    const result = await loginUseCase.execute('test@example.com', 'password123');

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.accessToken).toBe('access-token');
      expect(result.value.refreshToken).toBe('refresh-token');
      expect(result.value.user.email).toBe('test@example.com');
      expect(result.value.user.roles).toEqual(['ADMIN']);
    }
    expect(userRepository.findByEmail).toHaveBeenCalledWith('test@example.com');
    expect(passwordService.compare).toHaveBeenCalledWith('password123', 'hashed-password');
  });

  it('should return error when user not found', async () => {
    userRepository.findByEmail.mockResolvedValue(null);

    const result = await loginUseCase.execute('test@example.com', 'password123');

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(UnauthorizedException);
    }
    expect(passwordService.compare).not.toHaveBeenCalled();
  });

  it('should return error when user is inactive', async () => {
    const user = User.create({
      id: 'user-id',
      email: 'test@example.com',
      passwordHash: 'hashed-password',
      isActive: false,
    });

    userRepository.findByEmail.mockResolvedValue(user);

    const result = await loginUseCase.execute('test@example.com', 'password123');

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(UnauthorizedException);
    }
    expect(passwordService.compare).not.toHaveBeenCalled();
  });

  it('should return error when password is invalid', async () => {
    const user = User.create({
      id: 'user-id',
      email: 'test@example.com',
      passwordHash: 'hashed-password',
      isActive: true,
    });

    userRepository.findByEmail.mockResolvedValue(user);
    passwordService.compare.mockResolvedValue(false);

    const result = await loginUseCase.execute('test@example.com', 'wrong-password');

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(UnauthorizedException);
    }
    expect(jwtService.signAccessToken).not.toHaveBeenCalled();
  });

  it('should handle user with multiple roles', async () => {
    const user = User.create({
      id: 'user-id',
      email: 'test@example.com',
      passwordHash: 'hashed-password',
      isActive: true,
      roles: [
        {
          id: 'role-1',
          role: {
            id: 'role-1',
            name: 'ADMIN',
            description: 'Administrator',
          },
        },
        {
          id: 'role-2',
          role: {
            id: 'role-2',
            name: 'MANAGER',
            description: 'Manager',
          },
        },
      ],
    });

    userRepository.findByEmail.mockResolvedValue(user);
    passwordService.compare.mockResolvedValue(true);
    jwtService.signAccessToken.mockResolvedValue('access-token');
    jwtService.signRefreshToken.mockResolvedValue('refresh-token');

    const result = await loginUseCase.execute('test@example.com', 'password123');

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.user.roles).toEqual(['ADMIN', 'MANAGER']);
    }
  });

  it('should handle user with no roles', async () => {
    const user = User.create({
      id: 'user-id',
      email: 'test@example.com',
      passwordHash: 'hashed-password',
      isActive: true,
      roles: [],
    });

    userRepository.findByEmail.mockResolvedValue(user);
    passwordService.compare.mockResolvedValue(true);
    jwtService.signAccessToken.mockResolvedValue('access-token');
    jwtService.signRefreshToken.mockResolvedValue('refresh-token');

    const result = await loginUseCase.execute('test@example.com', 'password123');

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.user.roles).toEqual([]);
    }
  });
});

