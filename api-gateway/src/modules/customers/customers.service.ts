// modules/customers/customers.service.ts
import { Injectable } from '@nestjs/common';
import { BlockedCustomerService } from './blocked-customer.service';

@Injectable()
export class CustomersService {
  constructor(
    private readonly blockedCustomerService: BlockedCustomerService,
  ) {}

  verifyCustomer(customerData: {
    fullName: string;
    dob: Date;
    phone: string;
    nationalId?: string;
  }) {
    return {
      ok: true,
      normalized: {
        fullName: customerData.fullName,
        dob: customerData.dob.toISOString(),
        phone: customerData.phone,
        nationalId: customerData.nationalId || 'N/A',
      },
    };
  }

  // ✅ FIXED - Return the full object from service
  getBlockedList() {
    const blockedData = this.blockedCustomerService.getBlockedList();
    return {
      ...blockedData,
      totalCount:
        blockedData.customerIds.length +
        blockedData.phones.length +
        blockedData.nationalIds.length +
        blockedData.names.length,
    };
  }

  blockCustomer(customerId: string) {
    this.blockedCustomerService.blockCustomer(customerId);
    return {
      message: `Customer ${customerId} has been blocked`,
      customerId,
    };
  }

  unblockCustomer(customerId: string) {
    this.blockedCustomerService.unblockCustomer(customerId);
    return {
      message: `Customer ${customerId} has been unblocked`,
      customerId,
    };
  }

  isCustomerBlocked(customerId: string) {
    return {
      customerId,
      isBlocked: this.blockedCustomerService.isBlocked(customerId),
    };
  }
}
