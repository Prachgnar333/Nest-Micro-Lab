import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { BlockedCustomerService } from '../blocked-customer.service';

@Injectable()
export class BlockedCustomerPipe implements PipeTransform<string, string> {
  // ✅ Inject the service via constructor
  constructor(private readonly blockedService: BlockedCustomerService) {}

  transform(customerId: string): string {
    // 1. Check if value is string
    if (typeof customerId !== 'string') {
      throw new BadRequestException('customerId must be a string');
    }

    // 2. Check if customer is blocked using the service
    if (this.blockedService.isBlocked(customerId)) {
      throw new BadRequestException(
        `Customer ${customerId} is blocked and cannot proceed with verification`,
      );
    }

    // 3. Return the customerId unchanged (passed validation)
    return customerId;
  }
}
