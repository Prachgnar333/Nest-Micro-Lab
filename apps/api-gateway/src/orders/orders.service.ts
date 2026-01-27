// orders/orders.service.ts
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { NotificationsService } from 'src/notifications/notifications.service';
import { PaymentsService } from 'src/payments/payments.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @Inject('ORDERS_SERVICE') private readonly client: ClientProxy,
    private readonly paymentsService: PaymentsService,
    private readonly notifications: NotificationsService,
  ) {}

  createOrder(orderDto: CreateOrderDto) {
    // Calculate total
    const total = orderDto.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

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

    // Emit to RabbitMQ
    this.client.emit('order_created', order);

    // Call payment service
    this.paymentsService.hello();

    // Send notification
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
}
