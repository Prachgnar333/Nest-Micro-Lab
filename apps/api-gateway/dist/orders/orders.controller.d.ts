import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    create(dto: CreateOrderDto): {
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
    delete(): {
        status: string;
    };
}
