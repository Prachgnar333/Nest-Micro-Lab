"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notify = exports.NOTIFY_METADATA_KEY = void 0;
const common_1 = require("@nestjs/common");
exports.NOTIFY_METADATA_KEY = 'notify:config';
const Notify = (config) => (0, common_1.SetMetadata)(exports.NOTIFY_METADATA_KEY, config);
exports.Notify = Notify;
//# sourceMappingURL=notify.decorator.js.map