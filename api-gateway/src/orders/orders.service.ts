import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class OrdersService {
  constructor(
    @Inject('ORDERS_SERVICE') private readonly client: ClientProxy,
  ) {}

  async createOrder(orderDto: any) {
    // In real life we might validate or save to DB first
    // Here we just emit an event
    await this.client.emit('order_created', orderDto).toPromise();
    return { status: 'Order accepted', order: orderDto };
  }
}

