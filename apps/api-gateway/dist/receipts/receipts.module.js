"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReceiptsModule = void 0;
const common_1 = require("@nestjs/common");
const receipts_controller_1 = require("./receipts.controller");
const receipts_service_1 = require("./receipts.service");
const typeorm_1 = require("@nestjs/typeorm");
const receipts_entity_1 = require("./entities/receipts.entity");
const notifications_module_1 = require("../notifications/notifications.module");
let ReceiptsModule = class ReceiptsModule {
};
exports.ReceiptsModule = ReceiptsModule;
exports.ReceiptsModule = ReceiptsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([receipts_entity_1.Receipt]),
            notifications_module_1.NotificationsModule.forFeature({
                featureName: 'receipts',
                prefix: '[RECEIPTS]',
                channels: ['log'],
                enable: true,
            }),
        ],
        providers: [receipts_service_1.ReceiptsService],
        controllers: [receipts_controller_1.ReceiptsController],
    })
], ReceiptsModule);
//# sourceMappingURL=receipts.module.js.map