import { Module, Global } from '@nestjs/common';
import * as Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';

@Global()
@Module({})
export class SentryModule {
  static forRoot() {
    if (process.env.NODE_ENV === 'production' && process.env.SENTRY_DSN) {
      Sentry.init({
        dsn: process.env.SENTRY_DSN,
        environment: process.env.NODE_ENV,
        integrations: [nodeProfilingIntegration()],
        tracesSampleRate: process.env.SENTRY_TRACES_SAMPLE_RATE
          ? parseFloat(process.env.SENTRY_TRACES_SAMPLE_RATE)
          : 0.1,
        profilesSampleRate: process.env.SENTRY_PROFILES_SAMPLE_RATE
          ? parseFloat(process.env.SENTRY_PROFILES_SAMPLE_RATE)
          : 0.1,
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
      });
    }
    return {
      module: SentryModule,
    };
  }
}
