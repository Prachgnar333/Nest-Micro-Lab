"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const user_entity_1 = require("../entities/user.entity");
const role_entity_1 = require("../entities/role.entity");
const permission_entity_1 = require("../entities/permission.entity");
const user_role_entity_1 = require("../entities/user-role.entity");
const role_permission_entity_1 = require("../entities/role-permission.entity");
const refresh_token_entity_1 = require("../entities/refresh-token.entity");
let DatabaseModule = class DatabaseModule {
};
exports.DatabaseModule = DatabaseModule;
exports.DatabaseModule = DatabaseModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule,
            typeorm_1.TypeOrmModule.forRootAsync({
                inject: [config_1.ConfigService],
                useFactory: (cfg) => ({
                    type: 'postgres',
                    host: cfg.get('DB_HOST'),
                    port: Number(cfg.get('DB_PORT')),
                    username: cfg.get('DB_USER'),
                    password: cfg.get('DB_PASS'),
                    database: cfg.get('DB_NAME'),
                    entities: [
                        user_entity_1.User,
                        role_entity_1.Role,
                        permission_entity_1.Permission,
                        user_role_entity_1.UserRole,
                        role_permission_entity_1.RolePermission,
                        refresh_token_entity_1.RefreshToken,
                    ],
                    synchronize: true,
                    logging: true,
                }),
            }),
        ],
    })
], DatabaseModule);
//# sourceMappingURL=database.module.js.map