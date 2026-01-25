import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Counter, Histogram, Gauge, register } from 'prom-client';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class MetricsInterceptor implements NestInterceptor {
  private readonly httpRequestsTotal: Counter<string> | null;
  private readonly httpRequestDuration: Histogram<string> | null;
  private readonly httpRequestsInFlight: Gauge<string> | null;
  private readonly httpErrorsTotal: Counter<string> | null;

  constructor() {
    // Get metrics from default registry (created by MetricsModule)
    // Use null if metrics are not available (graceful degradation)
    try {
      this.httpRequestsTotal = (register.getSingleMetric('http_requests_total') as Counter<string>) || null;
      this.httpRequestDuration = (register.getSingleMetric('http_request_duration_seconds') as Histogram<string>) || null;
      this.httpRequestsInFlight = (register.getSingleMetric('http_requests_in_flight') as Gauge<string>) || null;
      this.httpErrorsTotal = (register.getSingleMetric('http_errors_total') as Counter<string>) || null;
    } catch {
      // If metrics are not available, set all to null
      this.httpRequestsTotal = null;
      this.httpRequestDuration = null;
      this.httpRequestsInFlight = null;
      this.httpErrorsTotal = null;
    }
  }

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

