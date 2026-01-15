import { AdminModule } from './admin/admin.module';
import { OrdersModule } from './orders/orders.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RbacModule } from './rbac/rbac.module';

@Module({
  imports: [
    // ✅ Load environment variables first
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // ✅ Use DatabaseModule instead of inline TypeORM config
    DatabaseModule,

    // ✅ Feature modules
    AuthModule,
    UsersModule,
    RbacModule,
    AdminModule,    
    OrdersModule,
  ],
})
export class AppModule {}