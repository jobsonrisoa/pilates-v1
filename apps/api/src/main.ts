import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import type { NextFunction, Request, Response } from 'express';
import { Logger } from 'nestjs-pino';

import { AppModule } from '@/app.module';
import { HttpExceptionFilter } from '@/shared/filters/http-exception.filter';
import { LoggingInterceptor } from '@/shared/interceptors/logging.interceptor';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  // Use Pino logger
  app.useLogger(app.get(Logger));
  const logger = app.get(Logger);

  // Request timeout (prevent long-running requests from tying up resources)
  app.use((req: Request, res: Response, next: NextFunction) => {
    if (typeof req.setTimeout === 'function') {
      req.setTimeout(30000); // 30 seconds
    }
    if (typeof res.setTimeout === 'function') {
      res.setTimeout(30000);
    }
    next();
  });

  // Security - Configure Helmet with specific policies
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https:"],
          connectSrc: ["'self'"],
          fontSrc: ["'self'", "data:"],
          objectSrc: ["'none'"],
          mediaSrc: ["'self'"],
          frameSrc: ["'none'"],
        },
      },
      hsts: {
        maxAge: 31536000, // 1 year
        includeSubDomains: true,
        preload: true,
      },
      crossOriginEmbedderPolicy: false, // Allow embedding if needed
    }),
  );

  // Cookie parser for httpOnly auth cookies (accessToken, refreshToken)
  app.use(cookieParser());

  // Compression with optimization
  app.use(
    compression({
      level: 6, // Balance between compression and CPU usage
      threshold: 1024, // Only compress responses > 1KB
      filter: (req, res) => {
        // Don't compress if client doesn't support it
        if (req.headers['x-no-compression']) {
          return false;
        }
        return compression.filter(req, res);
      },
    }),
  );

  // CORS configuration
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'];
  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Global exception filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // Global logging interceptor
  app.useGlobalInterceptors(new LoggingInterceptor());

  // Set global API prefix for versioning
  app.setGlobalPrefix('api/v1');

  // Swagger documentation - Only in non-production or with authentication
  const nodeEnv = process.env.NODE_ENV || 'development';
  const port = process.env.APP_PORT ? Number(process.env.APP_PORT) : 3000;

  if (nodeEnv !== 'production') {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Pilates System API')
      .setDescription('Management system API (NestJS)')
      .setVersion('0.0.1')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('/api', app, document);
    logger.log(`📚 Swagger documentation: http://0.0.0.0:${port}/api`);
  } else {
    // In production, Swagger is disabled for security
    logger.warn('Swagger documentation is disabled in production');
  }

  await app.listen(port, '0.0.0.0');

  logger.log(`🚀 Application is running on: http://0.0.0.0:${port}`);
}

void bootstrap();
