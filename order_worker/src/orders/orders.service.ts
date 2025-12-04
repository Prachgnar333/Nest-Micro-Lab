import { Injectable, Logger } from '@nestjs/common';
import { RmqContext } from '@nestjs/microservices';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);
  private readonly processedOrders: any[] = []; // simple "DB"

  processOrder(data: any, context: RmqContext) {
    this.logger.log(`Received order_created event: ${JSON.stringify(data)}`);
    this.processedOrders.push({
      ...data,
      processedAt: new Date().toISOString(),
    });
    this.logger.log(`Order processed successfully. Total orders: ${this.processedOrders.length}`);

    try {
      const channel = context.getChannelRef();
      const originalMsg = context.getMessage();
      if (channel && originalMsg) {
        channel.ack(originalMsg);
      }
    } catch (error) {
      this.logger.error(`Error acknowledging message: ${error.message}`);
    }
  }

  // Optional: method to view "DB" in logs
  printAll() {
    this.logger.log(`All processed orders: ${JSON.stringify(this.processedOrders)}`);
  }
}


