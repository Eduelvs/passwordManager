import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  app.enableCors({ origin: true, credentials: true });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.use(cookieParser());

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

  const port = Number(process.env.PORT) || 3000;
  await app.listen(port, '0.0.0.0');
  logger.log(
    `API em http://127.0.0.1:${port}  |  Swagger: http://127.0.0.1:${port}/docs`,
  );
}

bootstrap().catch((err: unknown) => {
  const logger = new Logger('Bootstrap');
  logger.error(
    'Falha ao subir o servidor',
    err instanceof Error ? err.stack : String(err),
  );
  process.exit(1);
});
