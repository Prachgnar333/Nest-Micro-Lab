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
exports.NotifyInterceptor = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const operators_1 = require("rxjs/operators");
const notifications_service_1 = require("../notifications.service");
const notify_decorator_1 = require("../decorators/notify.decorator");
let NotifyInterceptor = class NotifyInterceptor {
    reflector;
    notificationService;
    constructor(reflector, notificationService) {
        this.reflector = reflector;
        this.notificationService = notificationService;
    }
    intercept(context, next) {
        const notifyConfig = this.reflector.get(notify_decorator_1.NOTIFY_METADATA_KEY, context.getHandler());
        if (!notifyConfig) {
            return next.handle();
        }
        return next.handle().pipe((0, operators_1.tap)((result) => {
            const { featureName, event, payloadBuilder } = notifyConfig;
            const payload = payloadBuilder
                ? payloadBuilder(result, context.getArgs())
                : result;
            this.notificationService.notify(featureName, event, payload);
        }));
    }
};
exports.NotifyInterceptor = NotifyInterceptor;
exports.NotifyInterceptor = NotifyInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector,
        notifications_service_1.NotificationsService])
], NotifyInterceptor);
//# sourceMappingURL=notify.interceptor.js.map