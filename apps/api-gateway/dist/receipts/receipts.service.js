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
exports.ReceiptsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const receipts_entity_1 = require("./entities/receipts.entity");
const notifications_service_1 = require("../notifications/notifications.service");
const typeorm_2 = require("typeorm");
const create_receipt_dto_1 = require("./dto/create-receipt.dto");
const update_receipt_dto_1 = require("./dto/update-receipt.dto");
const notify_decorator_1 = require("../notifications/decorators/notify.decorator");
const notify_interceptor_1 = require("../notifications/interceptors/notify.interceptor");
let ReceiptsService = class ReceiptsService {
    receiptRepo;
    notifications;
    constructor(receiptRepo, notifications) {
        this.receiptRepo = receiptRepo;
        this.notifications = notifications;
    }
    async findAll() {
        return this.receiptRepo.find({ order: { issuedAt: 'DESC' } });
    }
    async findOne(receiptId) {
        const receipt = await this.receiptRepo.findOne({ where: { receiptId } });
        if (!receipt)
            throw new common_1.NotFoundException('Receipt not found');
        return receipt;
    }
    async create(dto) {
        const saved = await this.receiptRepo.save(this.receiptRepo.create({
            issuedAt: new Date(dto.issuedAt),
            name: dto.name,
            price: dto.price,
        }));
        return saved;
    }
    async update(receiptId, dto) {
        const receipt = await this.findOne(receiptId);
        if (dto.issuedAt !== undefined)
            receipt.issuedAt = new Date(dto.issuedAt);
        if (dto.name !== undefined)
            receipt.name = dto.name;
        if (dto.price !== undefined)
            receipt.price = dto.price;
        const saved = await this.receiptRepo.save(receipt);
        return saved;
    }
    hello() {
        return 'Hello from receipt service';
    }
};
exports.ReceiptsService = ReceiptsService;
__decorate([
    (0, notify_decorator_1.Notify)({
        featureName: 'receipts',
        event: 'receipt_created',
        payloadBuilder: (result) => ({
            receiptId: result.receiptId,
            price: result.price,
            name: result.name,
        }),
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_receipt_dto_1.CreateReceiptDto]),
    __metadata("design:returntype", Promise)
], ReceiptsService.prototype, "create", null);
__decorate([
    (0, notify_decorator_1.Notify)({
        featureName: 'receipts',
        event: 'receipt_updated',
        payloadBuilder: (result) => ({
            receiptId: result.receiptId,
            price: result.price,
            updatedFields: ['price', 'name'],
        }),
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_receipt_dto_1.UpdateReceiptDto]),
    __metadata("design:returntype", Promise)
], ReceiptsService.prototype, "update", null);
exports.ReceiptsService = ReceiptsService = __decorate([
    (0, common_1.Injectable)(),
    (0, common_1.UseInterceptors)(notify_interceptor_1.NotifyInterceptor),
    __param(0, (0, typeorm_1.InjectRepository)(receipts_entity_1.Receipt)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        notifications_service_1.NotificationsService])
], ReceiptsService);
//# sourceMappingURL=receipts.service.js.map