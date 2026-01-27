import { ClientProxy } from '@nestjs/microservices';
import { NotificationsService } from 'src/notifications/notifications.service';
import { PaymentsService } from 'src/payments/payments.service';
import { CreateOrderDto } from './dto/create-order.dto';
export declare class OrdersService {
    private readonly client;
    private readonly paymentsService;
    private readonly notifications;
    constructor(client: ClientProxy, paymentsService: PaymentsService, notifications: NotificationsService);
    createOrder(orderDto: CreateOrderDto): {
        ok: boolean;
        message: string;
        order: {
            orderId: string;
            customer: {
                fullName: string;
                dob: string;
                phone: string;
                nationalId: string;
            };
            items: {
                productId: string;
                quantity: number;
                price: number;
            }[];
            total: number;
            shippingAddress: string;
            notes: string;
            status: string;
            createdAt: string;
        };
    };
    deleteOrder(): {
        status: string;
    };
}
