import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import { UserRepository } from '@/modules/auth/domain/repositories/user.repository';
import { User } from '@/modules/auth/domain/entities/user.entity';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  let configService: jest.Mocked<ConfigService>;
  let userRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    configService = {
      get: jest.fn(),
    } as unknown as jest.Mocked<ConfigService>;

    userRepository = {
      findByEmail: jest.fn(),
      findById: jest.fn(),
    } as unknown as jest.Mocked<UserRepository>;

    (configService.get as jest.Mock).mockReturnValue('test-secret');
  });

  describe('constructor', () => {
    it('should throw error if JWT_SECRET is not configured', () => {
      (configService.get as jest.Mock).mockReturnValue(undefined);

      expect(() => {
        new JwtStrategy(configService, userRepository);
      }).toThrow('JWT_SECRET is required but not configured');
    });

    it('should initialize with valid JWT_SECRET', () => {
      expect(() => {
        new JwtStrategy(configService, userRepository);
      }).not.toThrow();
    });
  });

  describe('validate', () => {
    beforeEach(() => {
      strategy = new JwtStrategy(configService, userRepository);
    });

    it('should return user payload for valid user', async () => {
      const user = User.create({
        id: 'user-id',
        email: 'test@example.com',
        passwordHash: 'hash',
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

      const payload = {
        sub: 'user-id',
        email: 'test@example.com',
        roles: ['ADMIN'],
      };

      userRepository.findById.mockResolvedValue(user);

      const result = await strategy.validate(payload);

      expect(result).toEqual({
        id: 'user-id',
        email: 'test@example.com',
        roles: ['ADMIN'],
      });
      expect(userRepository.findById).toHaveBeenCalledWith('user-id');
    });

    it('should throw UnauthorizedException if user not found', async () => {
      const payload = {
        sub: 'non-existent-id',
        email: 'test@example.com',
        roles: ['ADMIN'],
      };

      userRepository.findById.mockResolvedValue(null);

      await expect(strategy.validate(payload)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if user is inactive', async () => {
      const user = User.create({
        id: 'user-id',
        email: 'test@example.com',
        passwordHash: 'hash',
        isActive: false,
      });

      const payload = {
        sub: 'user-id',
        email: 'test@example.com',
        roles: ['ADMIN'],
      };

      userRepository.findById.mockResolvedValue(user);

      await expect(strategy.validate(payload)).rejects.toThrow(UnauthorizedException);
    });
  });
});

