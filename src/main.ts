import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import  cookieParser   from 'cookie-parser'

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  console.log(`Server running on http://localhost:${process.env.PORT}`);
  app.enableCors();

  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();
