import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

import { validateEnv } from '@/config/env.validation';
import { AuthModule } from '@/modules/auth/auth.module';
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
    ThrottlerModule.forRoot([
      {
        name: 'default',
        ttl: 60000, // 1 minute
        limit: 100, // 100 requests per minute (default for most endpoints)
      },
      {
        name: 'strict',
        ttl: 60000, // 1 minute
        limit: 5, // 5 requests per minute (for sensitive endpoints like login)
      },
    ]),
    SentryModule.forRoot(),
    LoggerModule,
    MetricsModule,
    PrismaModule,
    HealthModule,
    AuthModule,
  ],
  providers: [
    MetricsInterceptor,
    {
      provide: APP_INTERCEPTOR,
      useClass: MetricsInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
