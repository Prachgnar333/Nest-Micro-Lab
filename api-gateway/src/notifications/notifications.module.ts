import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { OrdersModule } from 'src/orders/orders.module';
import { forwardRef, Module } from '@nestjs/common';
import { CoreModule } from 'src/core/core.module';
@Module({
  imports: [CoreModule],
  providers: [NotificationsService],
  exports: [NotificationsService],
  controllers: [],
})
export class NotificationsModule {}
