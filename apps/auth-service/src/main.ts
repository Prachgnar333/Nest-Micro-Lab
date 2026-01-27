import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(require("express").json({ limit: "1mb" }));
  await app.listen(process.env.AUTH_PORT ?? 3001);
}
bootstrap();
