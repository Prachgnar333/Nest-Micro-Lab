import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(require('express').json({ limit: '1mb' }));
  const port = process.env.ORDER_PORT ?? 3002;
  await app.listen(port);
  console.log(`🚀 Order Worker running on http://localhost:${port}`);
}
bootstrap();
