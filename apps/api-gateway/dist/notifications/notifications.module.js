"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var NotificationsModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsModule = void 0;
const common_1 = require("@nestjs/common");
const constants_1 = require("./constants");
const notifications_service_1 = require("./notifications.service");
const notify_interceptor_1 = require("./interceptors/notify.interceptor");
let NotificationsModule = class NotificationsModule {
    static { NotificationsModule_1 = this; }
    static features = [];
    static forRoot(options) {
        NotificationsModule_1.features = [];
        return {
            module: NotificationsModule_1,
            providers: [
                {
                    provide: constants_1.NOTIFICATION_OPTIONS,
                    useValue: options,
                },
                {
                    provide: constants_1.NOTIFICATION_FEATURES,
                    useFactory: () => NotificationsModule_1.features,
                },
                notifications_service_1.NotificationsService,
                notify_interceptor_1.NotifyInterceptor,
            ],
            exports: [notifications_service_1.NotificationsService, notify_interceptor_1.NotifyInterceptor],
        };
    }
    static forFeature(feature) {
        NotificationsModule_1.features.push(feature);
        return {
            module: NotificationsModule_1,
            providers: [],
            exports: [],
        };
    }
};
exports.NotificationsModule = NotificationsModule;
exports.NotificationsModule = NotificationsModule = NotificationsModule_1 = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({})
], NotificationsModule);
//# sourceMappingURL=notifications.module.js.map