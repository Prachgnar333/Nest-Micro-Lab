// orders/orders.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'; // <--- NEW IMPORT
import { Repository } from 'typeorm';
import { Order } from './order.entity'; // <--- NEW IMPORT

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);
  
  // Inject the TypeORM Repository for the Order entity
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>, // <--- NEW INJECTION
  ) {}

  // This is the business logic function called by the controller
  async processOrder(data: any): Promise<void> { // Made async
    this.logger.log(`Processing order: ${JSON.stringify(data)}`);
    
    // Create a new Order entity
    const newOrder = this.orderRepository.create({
      data: data,
    });

    // Save the new entity to the database
    await this.orderRepository.save(newOrder); // <--- DB SAVE OPERATION
    
    this.logger.log(`Order with ID ${newOrder.id} successfully saved to Postgres.`);
  }
  
  // Method to view all orders (for debugging)
  async printAll(): Promise<void> {
    const allOrders = await this.orderRepository.find();
    this.logger.log(`All processed orders: ${JSON.stringify(allOrders)}`);
  }
}