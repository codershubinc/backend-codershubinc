import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import cookieParser from 'cookie-parser'
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(cookieParser());
  console.log(`Server running on http://localhost:${process.env.PORT}`);
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'https://api.codershubinc.tech/',
      'https://codershubinc.tech/',
      'https://www.codershubinc.tech/',
      'http://localhost:3002/'
    ], // or your frontend URL
    credentials: true, // important for cookies
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Accept', 'Authorization'],
  });
  // Configure static file serving
  app.useStaticAssets(join(__dirname, '..', 'public'), {
    prefix: '/' // This means files in public folder will be served from root URL
  });

  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();
