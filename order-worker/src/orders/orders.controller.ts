// orders.controller.ts
import { Controller, Logger } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { EventPattern } from '@nestjs/microservices';

@Controller('orders')
export class OrdersController {
  private readonly logger = new Logger(OrdersController.name);

  constructor(private readonly ordersService: OrdersService) {} // Inject the service

  // The event listener goes here
  @EventPattern('order_created')
  handleOrderCreated() {
    console.log(`Received order_created event in controller.`);
  }
}
