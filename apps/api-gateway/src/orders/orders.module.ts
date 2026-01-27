// orders/orders.module.ts - UPDATED
import { forwardRef, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { PaymentsModule } from 'src/payments/payments.module';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { VerifyOrderCustomerPipe } from './pipes/verify-order-customer.pipe'; // ✅ NEW

@Module({
  imports: [
    forwardRef(() => PaymentsModule),

    ClientsModule.register([
      {
        name: 'ORDERS_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL || 'amqp://rabbitmq:5672'],
          queue: 'orders_queue',
          queueOptions: { durable: false },
        },
      },
    ]),
    NotificationsModule.forFeature({
      featureName: 'orders',
      prefix: '[ORDERS]',
      channels: ['log', 'telegram'],
    }),
  ],
  controllers: [OrdersController],
  providers: [
    OrdersService,
    VerifyOrderCustomerPipe, // ✅ Register
  ],
  exports: [OrdersService],
})
export class OrdersModule {}
