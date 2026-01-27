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
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const notifications_service_1 = require("../notifications/notifications.service");
const payments_service_1 = require("../payments/payments.service");
let OrdersService = class OrdersService {
    client;
    paymentsService;
    notifications;
    constructor(client, paymentsService, notifications) {
        this.client = client;
        this.paymentsService = paymentsService;
        this.notifications = notifications;
    }
    createOrder(orderDto) {
        const total = orderDto.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const order = {
            orderId: `ORD-${Date.now()}`,
            customer: {
                fullName: orderDto.customerFullName,
                dob: orderDto.customerDob,
                phone: orderDto.customerPhone,
                nationalId: orderDto.customerNationalId || 'N/A',
            },
            items: orderDto.items,
            total,
            shippingAddress: orderDto.shippingAddress || 'Not provided',
            notes: orderDto.notes || '',
            status: 'pending',
            createdAt: new Date().toISOString(),
        };
        this.client.emit('order_created', order);
        this.paymentsService.hello();
        this.notifications.notify('orders', 'order_created', {
            orderId: order.orderId,
            customer: order.customer.fullName,
            total: order.total,
        });
        return {
            ok: true,
            message: 'Order created successfully',
            order,
        };
    }
    deleteOrder() {
        this.client.emit('order_deleted', 'aaa');
        return { status: 'Order deleted' };
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('ORDERS_SERVICE')),
    __metadata("design:paramtypes", [microservices_1.ClientProxy,
        payments_service_1.PaymentsService,
        notifications_service_1.NotificationsService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map