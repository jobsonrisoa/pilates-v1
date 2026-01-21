import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import compression from 'compression';
import helmet from 'helmet';

import { AppModule } from '@/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true
  });

  app.use(helmet());
  app.use(compression());

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Pilates System API')
    .setDescription('API do sistema de gestão (NestJS)')
    .setVersion('0.0.1')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('/api', app, document);

  const port = process.env.APP_PORT ? Number(process.env.APP_PORT) : 3000;
  await app.listen(port, '0.0.0.0');
}

bootstrap();


