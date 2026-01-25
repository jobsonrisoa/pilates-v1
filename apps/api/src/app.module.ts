import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { validateEnv } from '@/config/env.validation';
import { HealthModule } from '@/modules/health/health.module';
import { PrismaModule } from '@/shared/infrastructure/database/prisma.module';
import { LoggerModule } from '@/shared/infrastructure/logger/logger.module';
import { MetricsModule } from '@/shared/infrastructure/metrics/metrics.module';
import { SentryModule } from '@/shared/infrastructure/sentry/sentry.module';
import { MetricsInterceptor } from '@/shared/interceptors/metrics.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      validate: validateEnv,
    }),
    SentryModule.forRoot(),
    LoggerModule,
    MetricsModule,
    PrismaModule,
    HealthModule,
  ],
  providers: [
    MetricsInterceptor,
    {
      provide: APP_INTERCEPTOR,
      useClass: MetricsInterceptor,
    },
  ],
})
export class AppModule {}
