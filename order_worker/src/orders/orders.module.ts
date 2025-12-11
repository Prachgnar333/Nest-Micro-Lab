// orders.module.ts
import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service'; // <--- Import the controller
import { OrdersController } from './orders.controller';

@Module({
  controllers: [OrdersController], // <--- Declare the controller here
  providers: [OrdersService],
})
export class OrdersModule {}