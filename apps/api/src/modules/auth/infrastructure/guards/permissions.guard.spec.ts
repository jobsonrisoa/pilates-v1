import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { PermissionsGuard } from './permissions.guard';
import { AuthService } from '@/modules/auth/application/services/auth.service';
import { PERMISSIONS_KEY } from '@/modules/auth/infrastructure/decorators/require-permissions.decorator';

describe('PermissionsGuard', () => {
  let guard: PermissionsGuard;
  let reflector: Reflector;
  let authService: AuthService;

  const createMockContext = (user: { id: string; email: string; roles: string[] } | undefined) => {
    return {
      switchToHttp: () => ({
        getRequest: () => ({ user }),
      }),
      getHandler: () => ({}),
      getClass: () => ({}),
    } as unknown as ExecutionContext;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PermissionsGuard,
        {
          provide: Reflector,
          useValue: { getAllAndOverride: jest.fn() },
        },
        {
          provide: AuthService,
          useValue: { getUserPermissions: jest.fn().mockResolvedValue(['users:read']) },
        },
      ],
    }).compile();

    guard = module.get(PermissionsGuard);
    reflector = module.get(Reflector);
    authService = module.get(AuthService);
  });

  it('should allow when no permissions required', async () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue(undefined);
    const ctx = createMockContext({ id: 'u1', email: 'a@b.com', roles: ['ADMIN'] });

    const result = await guard.canActivate(ctx);
    expect(result).toBe(true);
    expect(authService.getUserPermissions).not.toHaveBeenCalled();
  });

  it('should allow when no permissions array (empty)', async () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue([]);
    const ctx = createMockContext({ id: 'u1', email: 'a@b.com', roles: ['ADMIN'] });

    const result = await guard.canActivate(ctx);
    expect(result).toBe(true);
  });

  it('should throw when user not authenticated', async () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue(['users:read']);
    const ctx = createMockContext(undefined);

    await expect(guard.canActivate(ctx)).rejects.toThrow(ForbiddenException);
    await expect(guard.canActivate(ctx)).rejects.toThrow('User not authenticated');
  });

  it('should allow SUPER_ADMIN without checking permissions', async () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue(['users:delete']);
    const ctx = createMockContext({
      id: 'u1',
      email: 'admin@pilates.with',
      roles: ['SUPER_ADMIN'],
    });

    const result = await guard.canActivate(ctx);
    expect(result).toBe(true);
    expect(authService.getUserPermissions).not.toHaveBeenCalled();
  });

  it('should allow when user has all required permissions', async () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue(['users:read']);
    (authService.getUserPermissions as jest.Mock).mockResolvedValue(['users:read', 'users:update']);
    const ctx = createMockContext({ id: 'u1', email: 'a@b.com', roles: ['ADMIN'] });

    const result = await guard.canActivate(ctx);
    expect(result).toBe(true);
    expect(authService.getUserPermissions).toHaveBeenCalledWith('u1');
  });

  it('should throw when user lacks required permission', async () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue(['users:delete']);
    (authService.getUserPermissions as jest.Mock).mockResolvedValue(['users:read']);
    const ctx = createMockContext({ id: 'u1', email: 'a@b.com', roles: ['ADMIN'] });

    await expect(guard.canActivate(ctx)).rejects.toThrow(ForbiddenException);
    await expect(guard.canActivate(ctx)).rejects.toThrow('Insufficient permissions');
  });
});
