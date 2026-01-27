import { OrdersService } from 'src/orders/orders.service';
export declare class PaymentsService {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    hello(): string;
}
