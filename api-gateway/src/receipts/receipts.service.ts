import { Injectable } from '@nestjs/common';

@Injectable()
export class ReceiptsService {
  hello(): string {
    return 'Hello from Receipts Service';
  }
}
