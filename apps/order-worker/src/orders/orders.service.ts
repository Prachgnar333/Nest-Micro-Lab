// orders/orders.service.ts
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);
  private orders: any[] = [];

  constructor() {}

  // This is the business logic function called by the controller
  async processOrder(data: any): Promise<void> {
    // Made async
    this.logger.log(`Processing order: ${JSON.stringify(data)}`);

    // Store order in memory array (for demo purposes)
    const order = {
      id: this.orders.length + 1,
      data: data,
      status: 'PROCESSED',
      processedAt: new Date(),
    };

    this.orders.push(order);
    this.logger.log(`Order with ID ${order.id} successfully processed.`);
  }

  // Method to view all orders (for debugging)
  async printAll(): Promise<void> {
    this.logger.log(`All processed orders: ${JSON.stringify(this.orders)}`);
  }

  // Get all orders
  async getAll(): Promise<any[]> {
    return this.orders;
  }
}
