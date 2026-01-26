import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/shared/infrastructure/database/prisma.service';
import { User } from '@/modules/auth/domain/entities/user.entity';
import { UserRepository } from '@/modules/auth/domain/repositories/user.repository';

@Injectable()
export class PrismaUserRepository extends UserRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });

    if (!user) {
      return null;
    }

    return User.create({
      id: user.id,
      email: user.email,
      passwordHash: user.passwordHash,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      roles: user.roles.map((userRole) => ({
        id: userRole.id,
        role: {
          id: userRole.role.id,
          name: userRole.role.name,
          description: userRole.role.description,
        },
      })),
    });
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });

    if (!user) {
      return null;
    }

    return User.create({
      id: user.id,
      email: user.email,
      passwordHash: user.passwordHash,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      roles: user.roles.map((userRole) => ({
        id: userRole.id,
        role: {
          id: userRole.role.id,
          name: userRole.role.name,
          description: userRole.role.description,
        },
      })),
    });
  }
}

