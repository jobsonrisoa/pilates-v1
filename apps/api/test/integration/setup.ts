import { PrismaService } from '@/shared/infrastructure/database/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from '@/shared/infrastructure/database/prisma.module';

let prisma: PrismaService;
let module: TestingModule;

beforeAll(async () => {
  module = await Test.createTestingModule({
    imports: [PrismaModule],
  }).compile();

  prisma = module.get<PrismaService>(PrismaService);
});

afterAll(async () => {
  await prisma.$disconnect();
  await module.close();
});

beforeEach(async () => {
  // Clean database before each test
  // Note: In a real scenario, you might want to use transactions or a test database
  // For now, we'll just ensure the connection is ready
  await prisma.$connect();
});

export { prisma, module };

