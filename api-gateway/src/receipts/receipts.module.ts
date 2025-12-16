import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReceiptsController } from './receipts.controller';
import { ReceiptsService } from './receipts.service';
import { Receipt } from './entities/receipts.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Receipt])],
  providers: [ReceiptsService],
  controllers: [ReceiptsController],
})
export class ReceiptsModule {}
