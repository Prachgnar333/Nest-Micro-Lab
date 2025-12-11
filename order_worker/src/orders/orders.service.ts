// orders.service.ts
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);
  private readonly processedOrders: any[] = []; // simple "DB"

  // This is the business logic function called by the controller
  processOrder(data: any): void { 
    this.logger.log(`Processing order: ${JSON.stringify(data)}`);
    this.processedOrders.push({
      ...data,
      processedAt: new Date().toISOString(),
    });
  }
  
  // Method to view "DB" in logs (useful for debugging)
  printAll(): void {
    this.logger.log(`All processed orders: ${JSON.stringify(this.processedOrders)}`);
  }
}