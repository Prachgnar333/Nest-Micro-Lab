import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('orders')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class OrdersController {
  @Get('ping')
  @Permissions('order.read')
  ping(@CurrentUser() user: any) {
    return {
      message: '📦 Order read access granted!',
      user: {
        id: user.userId,
        email: user.email,
        permissions: user.permissions,
      },
      timestamp: new Date(),
    };
  }

  @Get('create')
  @Permissions('order.write')
  create(@CurrentUser() user: any) {
    return {
      message: 'Order created',
      createdBy: user.email,
    };
  }
}