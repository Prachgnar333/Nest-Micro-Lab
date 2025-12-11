// order_worker/src/app.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // <-- 1. Import TypeOrmModule
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [
    // 2. Add the TypeOrmModule.forRoot() configuration here
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'postgres', // Service name from docker-compose
      port: 5432,
      username: process.env.POSTGRES_USER || 'postgres',
      password: process.env.POSTGRES_PASSWORD || 'postgres',
      database: process.env.POSTGRES_DB || 'order_worker',
      autoLoadEntities: true, 
      synchronize: true, // For development only!
    }),
    
    // Your existing module import
    OrdersModule,
  ],
})
export class AppModule {}