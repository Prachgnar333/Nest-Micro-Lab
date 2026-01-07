// modules/customers/pipes/customer-not-blocked.pipe.ts
import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { BlockedCustomerService } from '../blocked-customer.service';

@Injectable()
export class CustomerNotBlockedPipe implements PipeTransform<string, string> {
  // ✅ Inject the service via constructor
  constructor(private readonly blockedService: BlockedCustomerService) {}

  transform(phone: string): string {
    // 1. Check if value is string
    if (typeof phone !== 'string') {
      throw new BadRequestException('phone must be a string');
    }

    // 2. Check if phone is blocked using the service
    if (this.blockedService.isBlockedPhone(phone)) {
      throw new BadRequestException(
        `Phone number ${phone} is blocked. This customer cannot be verified.`,
      );
    }

    // 3. Return the phone unchanged (passed validation)
    return phone;
  }
}
