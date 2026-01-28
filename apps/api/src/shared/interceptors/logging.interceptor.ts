import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<{ method?: string; url?: string; ip?: string }>();
    const { method = 'UNKNOWN', url, ip = 'unknown' } = request ?? {};
    const userAgent = request?.get?.('user-agent') || '';
    const now = Date.now();

    // Sanitize URL to remove sensitive query parameters
    const sanitizedUrl = this.sanitizeUrl(url);

    this.logger.log(`→ ${method} ${sanitizedUrl} - ${ip} - ${userAgent}`);

    return next.handle().pipe(
      tap({
        next: () => {
          const response = context.switchToHttp().getResponse<{ statusCode?: number }>();
          const statusCode = response?.statusCode ?? 0;
          const delay = Date.now() - now;
          const sanitizedUrlNext = this.sanitizeUrl(url);
          this.logger.log(`← ${method} ${sanitizedUrlNext} ${statusCode} - ${delay}ms`);
        },
        error: (error: Error) => {
          const delay = Date.now() - now;
          const sanitizedUrlError = this.sanitizeUrl(url);
          this.logger.error(`✗ ${method} ${sanitizedUrlError} - ${delay}ms - ${error.message}`);
        },
      }),
    );
  }

  /**
   * Sanitize URL to remove sensitive information from query parameters
   * Prevents logging passwords, tokens, and other sensitive data
   */
  private sanitizeUrl(url?: string): string {
    if (!url) {
      return 'unknown';
    }

    try {
      const urlObj = new URL(url, 'http://localhost');
      const sensitiveParams = ['password', 'token', 'secret', 'key', 'authorization', 'auth'];

      sensitiveParams.forEach((param) => {
        if (urlObj.searchParams.has(param)) {
          urlObj.searchParams.set(param, '***REDACTED***');
        }
      });

      return urlObj.pathname + urlObj.search;
    } catch {
      // If URL parsing fails, return original URL without query string
      return url.split('?')[0];
    }
  }
}
