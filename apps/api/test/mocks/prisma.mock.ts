import { PrismaService } from '@/shared/infrastructure/database/prisma.service';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';

export type MockPrismaService = DeepMockProxy<PrismaService>;

export const createMockPrismaService = (): MockPrismaService => {
  return mockDeep<PrismaService>();
};

