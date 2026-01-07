// modules/customers/customers.module.ts
import { Module } from '@nestjs/common';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';
import { BlockedCustomerService } from './blocked-customer.service';
import { DobPipe } from './pipes/dob.pipe';
import { PhonePipe } from './pipes/phone.pipe';
import { TrimPipe } from './pipes/trim.pipe';
import { CustomerNotBlockedPipe } from './pipes/customer-not-blocked.pipe';
import { VerifyCustomerPipe } from './pipes/verify-customer.pipe'; // ✅ NEW

@Module({
  controllers: [CustomersController],
  providers: [
    CustomersService,
    BlockedCustomerService,
    DobPipe,
    PhonePipe,
    TrimPipe,
    CustomerNotBlockedPipe,
    VerifyCustomerPipe, // ✅ Register
  ],
  exports: [
    CustomersService,
    BlockedCustomerService,
    DobPipe,
    PhonePipe,
    TrimPipe,
    CustomerNotBlockedPipe,
    VerifyCustomerPipe, // ✅ Export
  ],
})
export class CustomersModule {}
