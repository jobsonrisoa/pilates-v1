import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { HealthModule } from '@/modules/health/health.module';
import { PrismaModule } from '@/shared/infrastructure/database/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true
    }),
    PrismaModule,
    HealthModule
  ]
})
export class AppModule {}


