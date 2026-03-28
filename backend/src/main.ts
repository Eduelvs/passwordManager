import 'dotenv/config';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({ origin: true, credentials: true });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.use(cookieParser as any);

  const config = new DocumentBuilder()
    .setTitle('Password Manager API')
    .setDescription(
      'Auth (cadastro/login) e CRUD de senhas. Use login no Swagger e depois Authorize com cookie `token`.',
    )
    .setVersion('1.0')
    .addCookieAuth('token')
    .addTag('auth')
    .addTag('passwords')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(3001);
}

void bootstrap();
