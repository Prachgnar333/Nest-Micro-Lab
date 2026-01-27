import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { GatewayController } from './gateway.controller';
import { ProxyService } from './proxy.service';
import { AuthIntrospectionService } from './auth-introspection.service';

// Keep existing imports
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), HttpModule],
  controllers: [GatewayController, AppController],
  providers: [ProxyService, AuthIntrospectionService, AppService],
})
export class AppModule {}
