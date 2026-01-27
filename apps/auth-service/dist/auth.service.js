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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
let AuthService = class AuthService {
    constructor(jwt) {
        this.jwt = jwt;
        this.users = [
            {
                id: "u1",
                email: "admin@demo.com",
                password: "admin123",
                roles: ["admin"],
            },
            { id: "u2", email: "user@demo.com", password: "user123", roles: ["user"] },
        ];
    }
    async login(email, password) {
        const user = this.users.find((u) => u.email === email && u.password === password);
        if (!user)
            throw new common_1.UnauthorizedException("Invalid credentials");
        const payload = { sub: user.id, email: user.email, roles: user.roles };
        const accessToken = await this.jwt.signAsync(payload);
        return { accessToken };
    }
    getUserById(id) {
        const u = this.users.find((x) => x.id === id);
        if (!u)
            return null;
        return { id: u.id, email: u.email, roles: u.roles };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map