import { JwtService } from './jwt.service';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

describe('JwtService', () => {
  let jwtService: JwtService;
  let nestJwtService: jest.Mocked<NestJwtService>;
  let configService: jest.Mocked<ConfigService>;

  beforeEach(() => {
    nestJwtService = {
      signAsync: jest.fn(),
      verifyAsync: jest.fn(),
    } as unknown as jest.Mocked<NestJwtService>;

    configService = {
      get: jest.fn(),
    } as unknown as jest.Mocked<ConfigService>;

    jwtService = new JwtService(nestJwtService, configService);
  });

  describe('signAccessToken', () => {
    it('should sign access token with 15m expiration', async () => {
      const payload = {
        sub: 'user-id',
        email: 'test@example.com',
        roles: ['ADMIN'],
      };
      const token = 'access-token';

      (nestJwtService.signAsync as jest.Mock).mockResolvedValue(token);

      const result = await jwtService.signAccessToken(payload);

      expect(result).toBe(token);
      expect(nestJwtService.signAsync).toHaveBeenCalledWith(payload, {
        expiresIn: '15m',
      });
    });
  });

  describe('signRefreshToken', () => {
    it('should sign refresh token with 7d expiration when JWT_REFRESH_SECRET is configured', async () => {
      const payload = {
        sub: 'user-id',
        email: 'test@example.com',
        roles: ['ADMIN'],
      };
      const token = 'refresh-token';
      const jwtSecret = 'jwt-secret';

      (configService.get as jest.Mock).mockImplementation((key: string) => {
        if (key === 'JWT_REFRESH_SECRET') return jwtSecret;
        return undefined;
      });
      (nestJwtService.signAsync as jest.Mock).mockResolvedValue(token);

      const result = await jwtService.signRefreshToken(payload);

      expect(result).toBe(token);
      expect(nestJwtService.signAsync).toHaveBeenCalledWith(payload, {
        expiresIn: '7d',
        secret: jwtSecret,
      });
    });

    it('should throw when JWT_REFRESH_SECRET is not configured', async () => {
      const payload = {
        sub: 'user-id',
        email: 'test@example.com',
        roles: ['ADMIN'],
      };
      await expect(jwtService.signRefreshToken(payload)).rejects.toThrow(
        'JWT_REFRESH_SECRET is required but not configured',
      );
    });
  });

  describe('verify', () => {
    it('should verify access token', async () => {
      const token = 'access-token';
      const payload = {
        sub: 'user-id',
        email: 'test@example.com',
        roles: ['ADMIN'],
      };

      (nestJwtService.verifyAsync as jest.Mock).mockResolvedValue(payload);

      const result = await jwtService.verify(token);

      expect(result).toEqual(payload);
      expect(nestJwtService.verifyAsync).toHaveBeenCalledWith(token);
    });
  });

  describe('verifyRefreshToken', () => {
    it('should verify refresh token when JWT_REFRESH_SECRET is configured', async () => {
      const token = 'refresh-token';
      const payload = {
        sub: 'user-id',
        email: 'test@example.com',
        roles: ['ADMIN'],
      };
      const jwtSecret = 'jwt-secret';

      (configService.get as jest.Mock).mockImplementation((key: string) => {
        if (key === 'JWT_REFRESH_SECRET') return jwtSecret;
        return undefined;
      });
      (nestJwtService.verifyAsync as jest.Mock).mockResolvedValue(payload);

      const result = await jwtService.verifyRefreshToken(token);

      expect(result).toEqual(payload);
      expect(nestJwtService.verifyAsync).toHaveBeenCalledWith(token, {
        secret: jwtSecret,
      });
    });

    it('should throw when JWT_REFRESH_SECRET is not configured', async () => {
      const token = 'refresh-token';

      await expect(jwtService.verifyRefreshToken(token)).rejects.toThrow(
        'JWT_REFRESH_SECRET is required but not configured',
      );
    });
  });
});

