import { Controller, Get } from '@nestjs/common';
import { ReceiptsService } from './receipts.service';

@Controller('receipts')
export class ReceiptsController {
  constructor(private readonly receiptsService: ReceiptsService) {}
  @Get()
  getReceipts(): string {
    // return this.receiptsService.hello();
    return 'List of receipts 88';
  }
}
