import { Module, Global } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';

@Global()
@Module({})
export class SentryModule {
  static forRoot() {
    const configService = new ConfigService();
    const nodeEnv = configService.get<string>('NODE_ENV');
    const sentryDsn = configService.get<string>('SENTRY_DSN');
    const appVersion = configService.get<string>('APP_VERSION') || 'unknown';

    if (nodeEnv === 'production' && sentryDsn) {
      Sentry.init({
        dsn: sentryDsn,
        environment: nodeEnv,
        release: appVersion,
        serverName: configService.get<string>('SERVER_NAME') || 'pilates-api',
        integrations: [nodeProfilingIntegration()],
        tracesSampleRate: configService.get<string>('SENTRY_TRACES_SAMPLE_RATE')
          ? parseFloat(configService.get<string>('SENTRY_TRACES_SAMPLE_RATE')!)
          : 0.1,
        profilesSampleRate: configService.get<string>('SENTRY_PROFILES_SAMPLE_RATE')
          ? parseFloat(configService.get<string>('SENTRY_PROFILES_SAMPLE_RATE')!)
          : 0.1,
        maxBreadcrumbs: 50,
        beforeSend(event, hint) {
          // Filter out 4xx errors (client errors)
          if (event.exception) {
            const error = hint.originalException;
            if (error && typeof error === 'object' && 'status' in error) {
              const status = (error as { status: number }).status;
              if (status >= 400 && status < 500) {
                return null; // Don't send 4xx errors to Sentry
              }
            }
          }
          return event;
        },
        beforeBreadcrumb(breadcrumb) {
          // Filter out sensitive breadcrumbs
          if (breadcrumb.category === 'console' && breadcrumb.level === 'debug') {
            return null;
          }
          return breadcrumb;
        },
      });
    }
    return {
      module: SentryModule,
    };
  }
}
