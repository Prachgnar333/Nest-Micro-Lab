"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcryptjs"));
const crypto_1 = require("crypto");
const user_entity_1 = require("../entities/user.entity");
const user_role_entity_1 = require("../entities/user-role.entity");
const role_permission_entity_1 = require("../entities/role-permission.entity");
const refresh_token_entity_1 = require("../entities/refresh-token.entity");
const role_entity_1 = require("../entities/role.entity");
let AuthService = class AuthService {
    constructor(jwt, users, userRoles, rolePerms, refreshTokens, roles) {
        this.jwt = jwt;
        this.users = users;
        this.userRoles = userRoles;
        this.rolePerms = rolePerms;
        this.refreshTokens = refreshTokens;
        this.roles = roles;
    }
    async register(email, password) {
        const existing = await this.users.findOne({ where: { email } });
        if (existing) {
            throw new common_1.ConflictException('User with this email already exists');
        }
        const passwordHash = await bcrypt.hash(password, 10);
        const user = this.users.create({
            email,
            passwordHash,
            isActive: true,
        });
        await this.users.save(user);
        let userRole = await this.roles.findOne({ where: { name: 'user' } });
        if (!userRole) {
            userRole = this.roles.create({ name: 'user' });
            await this.roles.save(userRole);
        }
        const userRoleAssignment = this.userRoles.create({
            user: user,
            role: userRole,
        });
        await this.userRoles.save(userRoleAssignment);
        return {
            message: 'User registered successfully',
            user: {
                id: user.id,
                email: user.email,
            },
        };
    }
    async login(email, password) {
        const user = await this.users.findOne({ where: { email } });
        if (!user)
            throw new common_1.UnauthorizedException('Invalid credentials');
        if (!user.isActive) {
            throw new common_1.UnauthorizedException('Account is disabled');
        }
        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok)
            throw new common_1.UnauthorizedException('Invalid credentials');
        const roles = await this.userRoles.find({
            where: { user: { id: user.id } },
            relations: { role: true, user: true },
        });
        const roleNames = roles.map((r) => r.role.name);
        const roleIds = roles.map((r) => r.role.id);
        let permissionKeys = [];
        if (roleIds.length > 0) {
            const perms = await this.rolePerms
                .createQueryBuilder('rp')
                .leftJoinAndSelect('rp.permission', 'permission')
                .where('rp.roleId IN (:...roleIds)', { roleIds })
                .getMany();
            permissionKeys = [...new Set(perms.map((x) => x.permission.key))];
        }
        const accessToken = await this.jwt.signAsync({
            sub: user.id,
            email: user.email,
            roles: roleNames,
            permissions: permissionKeys,
        }, {
            secret: process.env.JWT_ACCESS_SECRET,
            expiresIn: process.env.JWT_ACCESS_EXPIRATION ?? '15m',
        });
        const refreshToken = (0, crypto_1.randomBytes)(48).toString('hex');
        const refreshTokenHash = await bcrypt.hash(refreshToken, 10);
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);
        const tokenEntity = this.refreshTokens.create({
            user: user,
            tokenHash: refreshTokenHash,
            expiresAt,
            revokedAt: null,
        });
        await this.refreshTokens.save(tokenEntity);
        return {
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                email: user.email,
                roles: roleNames,
                permissions: permissionKeys,
            },
        };
    }
    async refresh(refreshToken) {
        if (!refreshToken) {
            throw new common_1.BadRequestException('Refresh token is required');
        }
        const storedTokens = await this.refreshTokens.find({
            where: { revokedAt: null },
            relations: { user: true },
        });
        let matchedToken = null;
        for (const token of storedTokens) {
            const isMatch = await bcrypt.compare(refreshToken, token.tokenHash);
            if (isMatch) {
                matchedToken = token;
                break;
            }
        }
        if (!matchedToken) {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
        if (new Date() > matchedToken.expiresAt) {
            throw new common_1.UnauthorizedException('Refresh token expired');
        }
        const user = matchedToken.user;
        const roles = await this.userRoles.find({
            where: { user: { id: user.id } },
            relations: { role: true },
        });
        const roleNames = roles.map((r) => r.role.name);
        const roleIds = roles.map((r) => r.role.id);
        let permissionKeys = [];
        if (roleIds.length > 0) {
            const perms = await this.rolePerms
                .createQueryBuilder('rp')
                .leftJoinAndSelect('rp.permission', 'permission')
                .where('rp.roleId IN (:...roleIds)', { roleIds })
                .getMany();
            permissionKeys = [...new Set(perms.map((x) => x.permission.key))];
        }
        const accessToken = await this.jwt.signAsync({
            sub: user.id,
            email: user.email,
            roles: roleNames,
            permissions: permissionKeys,
        }, {
            secret: process.env.JWT_ACCESS_SECRET,
            expiresIn: process.env.JWT_ACCESS_EXPIRATION ?? '15m',
        });
        matchedToken.revokedAt = new Date();
        await this.refreshTokens.save(matchedToken);
        const newRefreshToken = (0, crypto_1.randomBytes)(48).toString('hex');
        const newRefreshTokenHash = await bcrypt.hash(newRefreshToken, 10);
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);
        const newTokenEntity = this.refreshTokens.create({
            user: user,
            tokenHash: newRefreshTokenHash,
            expiresAt,
            revokedAt: null,
        });
        await this.refreshTokens.save(newTokenEntity);
        return {
            accessToken,
            refreshToken: newRefreshToken,
            user: {
                id: user.id,
                email: user.email,
                roles: roleNames,
                permissions: permissionKeys,
            },
        };
    }
    async logout(refreshToken) {
        if (!refreshToken) {
            throw new common_1.BadRequestException('Refresh token is required');
        }
        const storedTokens = await this.refreshTokens.find({
            where: { revokedAt: null },
        });
        for (const token of storedTokens) {
            const isMatch = await bcrypt.compare(refreshToken, token.tokenHash);
            if (isMatch) {
                token.revokedAt = new Date();
                await this.refreshTokens.save(token);
                return { message: 'Logged out successfully' };
            }
        }
        return { message: 'Logged out successfully' };
    }
    async getMe(userId) {
        const user = await this.users.findOne({ where: { id: userId } });
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        const roles = await this.userRoles.find({
            where: { user: { id: userId } },
            relations: { role: true },
        });
        const roleNames = roles.map((r) => r.role.name);
        const roleIds = roles.map((r) => r.role.id);
        let permissionKeys = [];
        if (roleIds.length > 0) {
            const perms = await this.rolePerms
                .createQueryBuilder('rp')
                .leftJoinAndSelect('rp.permission', 'permission')
                .where('rp.roleId IN (:...roleIds)', { roleIds })
                .getMany();
            permissionKeys = [...new Set(perms.map((x) => x.permission.key))];
        }
        return {
            id: user.id,
            email: user.email,
            isActive: user.isActive,
            roles: roleNames,
            permissions: permissionKeys,
        };
    }
    async validateUser(userId) {
        const user = await this.users.findOne({ where: { id: userId } });
        if (!user || !user.isActive) {
            return null;
        }
        return user;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(2, (0, typeorm_1.InjectRepository)(user_role_entity_1.UserRole)),
    __param(3, (0, typeorm_1.InjectRepository)(role_permission_entity_1.RolePermission)),
    __param(4, (0, typeorm_1.InjectRepository)(refresh_token_entity_1.RefreshToken)),
    __param(5, (0, typeorm_1.InjectRepository)(role_entity_1.Role)),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AuthService);
//# sourceMappingURL=auth.service.js.map