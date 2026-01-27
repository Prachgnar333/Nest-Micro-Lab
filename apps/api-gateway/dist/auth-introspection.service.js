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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthIntrospectionService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const config_1 = require("@nestjs/config");
const rxjs_1 = require("rxjs");
let AuthIntrospectionService = class AuthIntrospectionService {
    http;
    config;
    constructor(http, config) {
        this.http = http;
        this.config = config;
    }
    get authUrl() {
        return this.config.get('AUTH_SERVICE_URL');
    }
    extractBearerToken(authHeader) {
        if (!authHeader?.startsWith('Bearer '))
            return null;
        return authHeader.slice('Bearer '.length);
    }
    async validate(token) {
        try {
            const res = await (0, rxjs_1.firstValueFrom)(this.http.get(`${this.authUrl}/auth/me`, {
                headers: { Authorization: `Bearer ${token}` },
                timeout: 4000,
            }));
            return res.data;
        }
        catch {
            throw new common_1.UnauthorizedException('Invalid or expired token');
        }
    }
};
exports.AuthIntrospectionService = AuthIntrospectionService;
exports.AuthIntrospectionService = AuthIntrospectionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService,
        config_1.ConfigService])
], AuthIntrospectionService);
//# sourceMappingURL=auth-introspection.service.js.map