"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var DatabaseModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const database_constants_1 = require("./database.constants");
let DatabaseModule = DatabaseModule_1 = class DatabaseModule {
    static forRoot(options) {
        const dataSourceProvider = {
            provide: database_constants_1.DATA_SOURCE,
            useFactory: async () => {
                const ds = new typeorm_1.DataSource({
                    type: 'postgres',
                    host: options.host,
                    port: options.port,
                    username: options.username,
                    password: options.password,
                    database: options.database,
                    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
                    migrations: [__dirname + '/../migrations/*{.ts,.js}'],
                    migrationsRun: true,
                    synchronize: false,
                    logging: true,
                });
                return ds.initialize().then(async (ds) => {
                    const migrationsToRun = await ds.runMigrations();
                    if (migrationsToRun.length > 0) {
                        console.log('✅ Ran migrations:', migrationsToRun.map((m) => m.name));
                    }
                    return ds;
                });
            },
        };
        return {
            module: DatabaseModule_1,
            providers: [dataSourceProvider],
            exports: [dataSourceProvider],
        };
    }
    static forFeature(entities) {
        const providers = entities.map((entity) => ({
            provide: `${entity.name.toUpperCase()}_REPO`,
            useFactory: (dataSource) => dataSource.getRepository(entity),
            inject: [database_constants_1.DATA_SOURCE],
        }));
        return {
            module: DatabaseModule_1,
            providers,
            exports: providers,
        };
    }
};
exports.DatabaseModule = DatabaseModule;
exports.DatabaseModule = DatabaseModule = DatabaseModule_1 = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({})
], DatabaseModule);
//# sourceMappingURL=database.module.js.map