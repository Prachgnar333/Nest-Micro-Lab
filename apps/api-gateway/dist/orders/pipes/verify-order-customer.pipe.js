"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyOrderCustomerPipe = void 0;
const common_1 = require("@nestjs/common");
let VerifyOrderCustomerPipe = class VerifyOrderCustomerPipe {
    transform(body) {
        if (!body || typeof body !== 'object') {
            throw new common_1.BadRequestException('Request body must be an object');
        }
        const { customerFullName, customerDob, customerPhone, customerNationalId } = body;
        if (typeof customerFullName !== 'string') {
            throw new common_1.BadRequestException('customerFullName must be a string');
        }
        const fullName = customerFullName.trim();
        if (fullName.length === 0) {
            throw new common_1.BadRequestException('customerFullName cannot be empty');
        }
        if (typeof customerDob !== 'string') {
            throw new common_1.BadRequestException('customerDob must be a string');
        }
        const dobRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
        const dobMatch = customerDob.match(dobRegex);
        if (!dobMatch) {
            throw new common_1.BadRequestException('customerDob must be in format dd/mm/yyyy');
        }
        const [, dayStr, monthStr, yearStr] = dobMatch;
        const day = Number(dayStr);
        const month = Number(monthStr);
        const year = Number(yearStr);
        if (year >= 2010) {
            throw new common_1.BadRequestException('Customer must be born before 2010');
        }
        const dob = new Date(year, month - 1, day);
        if (dob.getFullYear() !== year ||
            dob.getMonth() !== month - 1 ||
            dob.getDate() !== day) {
            throw new common_1.BadRequestException(`Invalid date: ${customerDob}`);
        }
        if (typeof customerPhone !== 'string') {
            throw new common_1.BadRequestException('customerPhone must be a string');
        }
        let phone = customerPhone.replace(/[\s\-()]/g, '');
        if (!/^\+?\d+$/.test(phone)) {
            throw new common_1.BadRequestException('customerPhone must contain only digits');
        }
        if (phone.startsWith('0')) {
            phone = '+855' + phone.substring(1);
        }
        if (!phone.startsWith('+855')) {
            throw new common_1.BadRequestException('customerPhone must be a Cambodian number');
        }
        return {
            ...body,
            customerFullName: fullName,
            customerDob: dob,
            customerPhone: phone,
            customerNationalId: customerNationalId?.trim(),
        };
    }
};
exports.VerifyOrderCustomerPipe = VerifyOrderCustomerPipe;
exports.VerifyOrderCustomerPipe = VerifyOrderCustomerPipe = __decorate([
    (0, common_1.Injectable)()
], VerifyOrderCustomerPipe);
//# sourceMappingURL=verify-order-customer.pipe.js.map