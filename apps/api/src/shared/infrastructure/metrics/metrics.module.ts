import { Module } from '@nestjs/common';
import {
  PrometheusModule,
  makeCounterProvider,
  makeHistogramProvider,
  makeGaugeProvider,
} from '@willsoto/nestjs-prometheus';

const httpRequestsTotalProvider = makeCounterProvider({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status'],
});

const httpRequestDurationProvider = makeHistogramProvider({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route'],
  buckets: [0.1, 0.3, 0.5, 1, 2, 5],
});

const httpRequestsInFlightProvider = makeGaugeProvider({
  name: 'http_requests_in_flight',
  help: 'Number of HTTP requests currently in flight',
  labelNames: ['method', 'route'],
});

const httpErrorsTotalProvider = makeCounterProvider({
  name: 'http_errors_total',
  help: 'Total number of HTTP errors',
  labelNames: ['method', 'route', 'status', 'error_type'],
});

@Module({
  imports: [
    PrometheusModule.register({
      path: '/metrics',
      defaultMetrics: {
        enabled: true,
      },
    }),
  ],
  providers: [
    httpRequestsTotalProvider,
    httpRequestDurationProvider,
    httpRequestsInFlightProvider,
    httpErrorsTotalProvider,
  ],
  exports: [
    PrometheusModule,
    httpRequestsTotalProvider,
    httpRequestDurationProvider,
    httpRequestsInFlightProvider,
    httpErrorsTotalProvider,
  ],
})
export class MetricsModule {}
