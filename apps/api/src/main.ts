import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  // Parse cookies (used for the httpOnly refresh token).
  app.use(
    cookieParser(config.get<string>('COOKIE_SECRET', 'dev-cookie-secret')),
  );

  // Let the React app (different origin/port) call this API in development.
  // credentials:true is required so the browser sends/receives the refresh cookie.
  app.enableCors({
    origin: config.get<string>('CORS_ORIGIN', 'http://localhost:5173'),
    credentials: true,
  });

  // Automatically validate and strip incoming request bodies/queries.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // All routes are prefixed with /api so the frontend has a clean base path.
  app.setGlobalPrefix('api');

  const port = config.get<number>('API_PORT', 3000);
  await app.listen(port);
  console.log(`API running at http://localhost:${port}/api`);
}

bootstrap();
