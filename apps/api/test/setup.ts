import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended';

import { PrismaService } from '@/shared/infrastructure/database/prisma.service';

// Create a mock PrismaService
export const prismaMock: DeepMockProxy<PrismaService> = mockDeep<PrismaService>();

// Mock the PrismaService module
jest.mock('@/shared/infrastructure/database/prisma.service', () => ({
  PrismaService: jest.fn(() => prismaMock),
}));

beforeEach(() => {
  mockReset(prismaMock);
});

