// modules/customers/customers.controller.ts
import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Get,
} from '@nestjs/common';
import { DobPipe } from './pipes/dob.pipe';
import { PhonePipe } from './pipes/phone.pipe';
import { TrimPipe } from './pipes/trim.pipe';
import { CustomerNotBlockedPipe } from './pipes/customer-not-blocked.pipe';
import { VerifyCustomerPipe } from './pipes/verify-customer.pipe'; // ✅ NEW
import { CustomersService } from './customers.service';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  // ===== Original endpoint (multiple pipes) =====
  @Post('verify')
  @HttpCode(HttpStatus.OK)
  verifyCustomer(
    @Body('fullName', TrimPipe) fullName: string,
    @Body('dob', DobPipe) dob: Date,
    @Body('phone', PhonePipe, CustomerNotBlockedPipe) phone: string,
    @Body('nationalId') nationalId?: string,
  ) {
    return this.customersService.verifyCustomer({
      fullName,
      dob,
      phone,
      nationalId,
    });
  }

  // ===== ✅ NEW: Single pipe validates everything =====
  @Post('verify-v2')
  @HttpCode(HttpStatus.OK)
  verifyCustomerV2(@Body(VerifyCustomerPipe) body: any) {
    // Body is already validated and transformed by VerifyCustomerPipe
    // - fullName is trimmed
    // - dob is a Date object
    // - phone is normalized
    // - nationalId is validated (if provided)
    return this.customersService.verifyCustomer(body);
  }

  @Get('blocked')
  getBlockedCustomers() {
    return this.customersService.getBlockedList();
  }
}
