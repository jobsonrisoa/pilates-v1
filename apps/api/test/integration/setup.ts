import { Test, TestingModule } from '@nestjs/testing';

import { PrismaModule } from '@/shared/infrastructure/database/prisma.module';
import { PrismaService } from '@/shared/infrastructure/database/prisma.service';

let prisma: PrismaService;
let testingModule: TestingModule;

beforeAll(async () => {
  // Set test database URL if not already set
  if (!process.env.DATABASE_URL) {
    process.env.DATABASE_URL = 'mysql://root:test@localhost:3307/pilates_test';
  }

  testingModule = await Test.createTestingModule({
    imports: [PrismaModule],
  }).compile();

  prisma = testingModule.get<PrismaService>(PrismaService);
  
  // Ensure connection is ready
  await prisma.$connect();
});

afterAll(async () => {
  if (prisma) {
    await prisma.$disconnect();
  }
  if (testingModule) {
    await testingModule.close();
  }
});

beforeEach(async () => {
  // Clean database before each test
  // Note: In a real scenario, you might want to use transactions or a test database
  // For now, we'll just ensure the connection is ready
  await prisma.$connect();
});

export { prisma, testingModule };

