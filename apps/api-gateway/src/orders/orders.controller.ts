// orders/orders.controller.ts
import {
  Body,
  Controller,
  Delete,
  Post,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { VerifyOrderCustomerPipe } from './pipes/verify-order-customer.pipe';
// ❌ REMOVED: import { CustomerNotBlockedPipe } from 'src/modules/customers/pipes/customer-not-blocked.pipe';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body(VerifyOrderCustomerPipe) dto: CreateOrderDto,
    // ❌ REMOVED: @Body('customerPhone', CustomerNotBlockedPipe) phone: string,
  ) {
    return this.ordersService.createOrder(dto);
  }

  @Delete()
  delete() {
    return this.ordersService.deleteOrder();
  }
}
