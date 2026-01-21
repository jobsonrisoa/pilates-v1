import { Injectable } from '@nestjs/common';
import {
  HealthCheckError,
  HealthIndicator,
  HealthIndicatorResult
} from '@nestjs/terminus';

import { PrismaService } from '@/shared/infrastructure/database/prisma.service';

@Injectable()
export class PrismaHealthIndicator extends HealthIndicator {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    try {
      // query simples e barata para validar a conexão
      await this.prisma.$queryRaw`SELECT 1`;
      return this.getStatus(key, true);
    } catch (error) {
      const result = this.getStatus(key, false, { error: 'db_unreachable' });
      throw new HealthCheckError('Prisma health check failed', result);
    }
  }
}


