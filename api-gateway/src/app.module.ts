import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OrdersModule } from './orders/orders.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PaymentsModule } from './payments/payments.module';
import { NotificationsModule } from './notifications/notifications.module';
import { DatabaseModule } from './database/database.module';
import { CategoryModule } from './modules/category/category.module';
import { ProductModule } from './modules/product/product.module';
import { CustomersModule } from './modules/customers/customers.module'; // ✅ NEW

@Module({
  imports: [
    // ✅ 1. Load environment variables FIRST
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // ✅ 2. Setup DatabaseModule with env variables
    DatabaseModule.forRoot({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASS || 'postgres',
      database: process.env.DB_NAME || 'nest_lab',
    }),

    // ✅ 3. Configure global notification settings
    NotificationsModule.forRoot({
      appName: 'API Gateway Lab',
      defaultChannel: 'log',
      enable: true,
    }),

    // ✅ 4. Feature modules
    OrdersModule,
    PaymentsModule,
    CategoryModule,
    ProductModule,
    CustomersModule, // ✅ NEW: Customer verification
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
