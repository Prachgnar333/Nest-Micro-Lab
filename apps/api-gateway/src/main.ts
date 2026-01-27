import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

let appInstance: any = null;

async function bootstrap() {
  if (appInstance) {
    console.log('App already running, skipping bootstrap');
    return;
  }

  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(require('express').json({ limit: '2mb' }));

  const config = app.get(ConfigService);
  const port = config.get<number>('GATEWAY_PORT') ?? 3000;
  await app.listen(port);
  appInstance = app;
  console.log(`🚀 API Gateway running on http://localhost:${port}`);
}
bootstrap();
