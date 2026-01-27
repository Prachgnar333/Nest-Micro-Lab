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
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const constants_1 = require("./constants");
let NotificationsService = class NotificationsService {
    options;
    features;
    constructor(options, features) {
        this.options = options;
        this.features = features;
    }
    getFeature(featureName) {
        return this.features.find((f) => f.featureName === featureName);
    }
    isEnabled(feature) {
        if (!this.options.enable)
            return false;
        if (feature?.enable === false)
            return false;
        return true;
    }
    resolveChannels(feature) {
        if (feature?.channels?.length)
            return feature.channels;
        return [this.options.defaultChannel];
    }
    notify(featureName, event, payload) {
        const feature = this.getFeature(featureName);
        if (!this.isEnabled(feature)) {
            return {
                skipped: true,
                reason: feature?.enable === false
                    ? `feature '${featureName}' notifications disabled`
                    : 'notifications disabled globally',
            };
        }
        const channels = this.resolveChannels(feature);
        const prefix = feature?.prefix ?? `[${featureName.toUpperCase()}]`;
        const message = `${prefix} (${this.options.appName}) ${event}`;
        for (const ch of channels) {
            console.log(`[${ch.toUpperCase()}] ${message}`, payload);
        }
        return { ok: true, channels, featureName, event };
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(constants_1.NOTIFICATION_OPTIONS)),
    __param(1, (0, common_1.Inject)(constants_1.NOTIFICATION_FEATURES)),
    __metadata("design:paramtypes", [Object, Array])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map