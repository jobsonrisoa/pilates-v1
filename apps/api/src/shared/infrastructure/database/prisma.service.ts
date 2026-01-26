import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      log:
        process.env.NODE_ENV === 'development'
          ? ['query', 'error', 'warn']
          : ['error'],
      // Connection pooling is configured via DATABASE_URL query parameters:
      // Example: mysql://user:pass@host:3306/db?connection_limit=10&pool_timeout=20
      // Prisma will use these parameters automatically if present in DATABASE_URL
    });
  }

      async onModuleInit(): Promise<void> {
        await this.$connect();
      }

      async onModuleDestroy(): Promise<void> {
        await this.$disconnect();
      }
}
