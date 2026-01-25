import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Counter, Histogram, Gauge } from 'prom-client';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class MetricsInterceptor implements NestInterceptor {
  constructor(
    @InjectMetric('http_requests_total')
    private readonly httpRequestsTotal: Counter<string>,
    @InjectMetric('http_request_duration_seconds')
    private readonly httpRequestDuration: Histogram<string>,
    @InjectMetric('http_requests_in_flight')
    private readonly httpRequestsInFlight: Gauge<string>,
    @InjectMetric('http_errors_total')
    private readonly httpErrorsTotal: Counter<string>,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const { method, route } = request;

    // Normalize route path (remove IDs, etc.)
    const routePath = route?.path || request.url.split('?')[0] || 'unknown';
    const normalizedRoute = this.normalizeRoute(routePath);

    const labels = {
      method,
      route: normalizedRoute,
    };

    // Increment in-flight gauge
    this.httpRequestsInFlight.inc(labels);

    const startTime = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const statusCode = response.statusCode.toString();
          const duration = (Date.now() - startTime) / 1000; // Convert to seconds

          // Record metrics
          this.httpRequestsTotal.inc({ ...labels, status: statusCode });
          this.httpRequestDuration.observe(labels, duration);
          this.httpRequestsInFlight.dec(labels);
        },
        error: (error) => {
          const statusCode = error?.status?.toString() || '500';
          const duration = (Date.now() - startTime) / 1000;
          const errorType = error?.name || 'UnknownError';

          // Record error metrics
          this.httpRequestsTotal.inc({ ...labels, status: statusCode });
          this.httpRequestDuration.observe(labels, duration);
          this.httpRequestsInFlight.dec(labels);
          
          // Record error counter (only for 4xx and 5xx)
          if (parseInt(statusCode) >= 400) {
            this.httpErrorsTotal.inc({
              ...labels,
              status: statusCode,
              error_type: errorType,
            });
          }
        },
      }),
    );
  }

  private normalizeRoute(route: string): string {
    // Normalize route by replacing IDs and UUIDs with placeholders
    return route
      .replace(/\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi, '/:id')
      .replace(/\/\d+/g, '/:id')
      .replace(/\/$/, '') || '/';
  }
}
