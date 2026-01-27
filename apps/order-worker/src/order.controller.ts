import { Controller, Get, Post, Req, Body } from '@nestjs/common';
import { OrdersService } from './orders/orders.service';

@Controller('orders')
export class OrderController {
  constructor(private ordersService: OrdersService) {}

  // Public health check
  @Get('health')
  health() {
    return { ok: true, service: 'order-worker' };
  }

  // PROTECTED (Pattern A): Check x-user-id header from gateway
  @Get()
  async list(@Req() req: any) {
    const userId = req.headers['x-user-id'];
    const userEmail = req.headers['x-user-email'];

    if (!userId) {
      return { error: 'Unauthorized: x-user-id header required' };
    }

    const orders = await this.ordersService.getAll();
    return {
      userId,
      userEmail,
      orders,
    };
  }

  // PROTECTED (Pattern A) + role check
  @Post()
  async create(@Req() req: any, @Body() body: any) {
    const userId = req.headers['x-user-id'];
    const rolesHeader = req.headers['x-user-roles'];

    let roles: string[] = [];
    if (rolesHeader) {
      try {
        roles = JSON.parse(rolesHeader);
      } catch (e) {
        roles = rolesHeader.split(',').filter(Boolean);
      }
    }

    if (!userId) {
      return { error: 'Unauthorized: x-user-id header required' };
    }

    await this.ordersService.processOrder(body);

    return {
      created: true,
      userId,
      roles,
      order: body,
    };
  }
}
