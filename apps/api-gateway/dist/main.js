"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const config_1 = require("@nestjs/config");
let appInstance = null;
async function bootstrap() {
    if (appInstance) {
        console.log('App already running, skipping bootstrap');
        return;
    }
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors();
    app.use(require('express').json({ limit: '2mb' }));
    const config = app.get(config_1.ConfigService);
    const port = config.get('GATEWAY_PORT') ?? 3000;
    await app.listen(port);
    appInstance = app;
    console.log(`🚀 API Gateway running on http://localhost:${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map