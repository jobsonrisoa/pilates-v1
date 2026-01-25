import { mockDeep, DeepMockProxy } from 'jest-mock-extended';

import { PrismaService } from '@/shared/infrastructure/database/prisma.service';

export type MockPrismaService = DeepMockProxy<PrismaService>;

export const createMockPrismaService = (): MockPrismaService => {
  return mockDeep<PrismaService>();
};

