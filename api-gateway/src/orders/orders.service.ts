/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { NotificationsService } from 'src/notifications/notifications.service';
import { PaymentsService } from 'src/payments/payments.service';

@Injectable()
export class OrdersService {
  constructor(
    @Inject('ORDERS_SERVICE') private readonly client: ClientProxy,
    private readonly paymentsService: PaymentsService,
    private readonly notifications: NotificationsService,
  ) {}

  createOrder(orderDto: any) {
    // In real life we might validate or save to DB first
    // Here we just emit an event
    this.client.emit('order_created', '');
    this.paymentsService.hello();
    this.notifications.notify('order_created', {
      message: 'hello',
    });
    return { status: 'Order accepted', orderDto };
  }

  deleteOrder() {
    this.client.emit('order_deleted', 'aaa');
    return { status: 'Order deleted' };
  }
}
