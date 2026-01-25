import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import * as Sentry from '@sentry/node';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException ? exception.getResponse() : 'Internal server error';

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message:
        typeof message === 'string'
          ? message
          : (message as { message: string | string[] }).message || 'An error occurred',
    };

    // Set Sentry user context if available
    if (request.user && process.env.NODE_ENV === 'production') {
      Sentry.setUser({
        id: request.user.id,
        email: request.user.email,
        username: request.user.email,
      });
    }

    // Log error
    if (status >= 500) {
      this.logger.error(
        `${request.method} ${request.url} - ${status}`,
        exception instanceof Error ? exception.stack : JSON.stringify(exception),
      );

      // Capture error in Sentry (only for 5xx errors)
      if (process.env.NODE_ENV === 'production') {
        Sentry.captureException(exception);
      }
    } else {
      this.logger.warn(`${request.method} ${request.url} - ${status} - ${errorResponse.message}`);
    }

    response.status(status).json(errorResponse);
  }
}
