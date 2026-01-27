"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors();
    app.use(require("express").json({ limit: "1mb" }));
    await app.listen(process.env.AUTH_PORT ?? 3001);
}
bootstrap();
//# sourceMappingURL=main.js.map