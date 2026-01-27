"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GatewayController = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const proxy_service_1 = require("./proxy.service");
const auth_introspection_service_1 = require("./auth-introspection.service");
const crypto_1 = require("crypto");
let GatewayController = class GatewayController {
    config;
    proxy;
    auth;
    logger = new common_1.Logger('GatewayController');
    constructor(config, proxy, auth) {
        this.config = config;
        this.proxy = proxy;
        this.auth = auth;
    }
    async routeAll(req, res) {
        const requestId = req.headers['x-request-id'] ?? (0, crypto_1.randomUUID)();
        const startTime = Date.now();
        const full = req.originalUrl;
        const pathOnly = req.path;
        const afterApi = pathOnly.replace(/^\/api\//, '');
        const [serviceKey, ...rest] = afterApi.split('/');
        const forwardPath = '/' + rest.join('/');
        const route = this.resolveRoute(serviceKey);
        if (!route) {
            this.logger.warn(`Unknown route: ${serviceKey} (request-id: ${requestId})`);
            return res.status(404).json({ message: `Unknown route: ${serviceKey}` });
        }
        let user = null;
        const authHeader = req.headers['authorization'];
        const isHealthCheck = forwardPath.endsWith('/health') || forwardPath === '/health';
        if (route.protected && !isHealthCheck) {
            const token = this.auth.extractBearerToken(authHeader);
            if (!token)
                throw new common_1.UnauthorizedException('Missing Bearer token');
            const payload = await this.auth.validate(token);
            user = payload.user ?? payload;
        }
        const upstream = await this.proxy.forward({
            baseUrl: route.baseUrl,
            method: req.method,
            path: route.path + forwardPath,
            headers: {
                ...req.headers,
                'x-request-id': requestId,
                ...(user
                    ? {
                        'x-user-id': user.id,
                        'x-user-email': user.email,
                        'x-user-roles': JSON.stringify(user.roles ?? []),
                    }
                    : {}),
            },
            query: req.query,
            body: req.body,
        });
        const duration = Date.now() - startTime;
        this.logger.log(`${req.method} ${pathOnly} → ${serviceKey} [${upstream.status}] ${duration}ms (request-id: ${requestId})`);
        res.status(upstream.status);
        return res.send(upstream.data);
    }
    resolveRoute(serviceKey) {
        switch (serviceKey) {
            case 'auth':
                return {
                    baseUrl: this.config.get('AUTH_SERVICE_URL'),
                    path: '/auth',
                    protected: false,
                };
            case 'orders':
                return {
                    baseUrl: this.config.get('ORDER_SERVICE_URL'),
                    path: '/orders',
                    protected: true,
                };
            default:
                return null;
        }
    }
};
exports.GatewayController = GatewayController;
__decorate([
    (0, common_1.All)('*'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], GatewayController.prototype, "routeAll", null);
exports.GatewayController = GatewayController = __decorate([
    (0, common_1.Controller)('api'),
    __metadata("design:paramtypes", [config_1.ConfigService,
        proxy_service_1.ProxyService,
        auth_introspection_service_1.AuthIntrospectionService])
], GatewayController);
//# sourceMappingURL=gateway.controller.js.map