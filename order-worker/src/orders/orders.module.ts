// orders/orders.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // <--- NEW IMPORT
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order } from './order.entity'; // <--- NEW IMPORT

@Module({
  imports: [
    TypeOrmModule.forFeature([Order]), // <--- Register the Order Entity
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}