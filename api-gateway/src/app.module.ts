import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrdersModule } from './orders/orders.module';
import { ReceiptsModule } from './receipts/receipts.module';

@Module({
  imports: [OrdersModule, ReceiptsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
