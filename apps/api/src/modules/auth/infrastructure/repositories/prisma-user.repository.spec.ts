import { PrismaUserRepository } from './prisma-user.repository';
import { PrismaService } from '@/shared/infrastructure/database/prisma.service';
import { User } from '@/modules/auth/domain/entities/user.entity';

describe('PrismaUserRepository', () => {
  let repository: PrismaUserRepository;
  let prisma: jest.Mocked<PrismaService>;

  beforeEach(() => {
    prisma = {
      user: {
        findUnique: jest.fn(),
      },
    } as unknown as jest.Mocked<PrismaService>;

    repository = new PrismaUserRepository(prisma);
  });

  describe('findByEmail', () => {
    it('should return user when found', async () => {
      const email = 'test@example.com';
      const prismaUser = {
        id: 'user-id',
        email,
        passwordHash: 'hashed-password',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        roles: [
          {
            id: 'user-role-id',
            role: {
              id: 'role-id',
              name: 'ADMIN',
              description: 'Administrator',
            },
          },
        ],
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(prismaUser);

      const result = await repository.findByEmail(email);

      expect(result).toBeInstanceOf(User);
      expect(result?.email).toBe(email);
      expect(result?.getRoleNames()).toEqual(['ADMIN']);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email },
        include: {
          roles: {
            include: {
              role: true,
            },
          },
        },
      });
    });

    it('should return null when user not found', async () => {
      const email = 'notfound@example.com';

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await repository.findByEmail(email);

      expect(result).toBeNull();
    });

    it('should handle user with null role description', async () => {
      const email = 'test@example.com';
      const prismaUser = {
        id: 'user-id',
        email,
        passwordHash: 'hashed-password',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        roles: [
          {
            id: 'user-role-id',
            role: {
              id: 'role-id',
              name: 'ADMIN',
              description: null,
            },
          },
        ],
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(prismaUser);

      const result = await repository.findByEmail(email);

      expect(result).toBeInstanceOf(User);
      expect(result?.email).toBe(email);
      expect(result?.getRoleNames()).toEqual(['ADMIN']);
    });
  });

  describe('findById', () => {
    it('should return user when found', async () => {
      const id = 'user-id';
      const prismaUser = {
        id,
        email: 'test@example.com',
        passwordHash: 'hashed-password',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        roles: [],
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(prismaUser);

      const result = await repository.findById(id);

      expect(result).toBeInstanceOf(User);
      expect(result?.id).toBe(id);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id },
        include: {
          roles: {
            include: {
              role: true,
            },
          },
        },
      });
    });

    it('should return null when user not found', async () => {
      const id = 'non-existent-id';

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await repository.findById(id);

      expect(result).toBeNull();
    });
  });
});

