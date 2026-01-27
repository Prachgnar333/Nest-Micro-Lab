// orders/pipes/verify-order-customer.pipe.ts
import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

interface CustomerData {
  customerFullName: string;
  customerDob: string;
  customerPhone: string;
  customerNationalId?: string;
}

interface TransformedCustomerData {
  customerFullName: string;
  customerDob: Date;
  customerPhone: string;
  customerNationalId?: string;
}

@Injectable()
export class VerifyOrderCustomerPipe implements PipeTransform {
  transform(body: any): any {
    if (!body || typeof body !== 'object') {
      throw new BadRequestException('Request body must be an object');
    }

    // Extract customer fields
    const { customerFullName, customerDob, customerPhone, customerNationalId } =
      body;

    // ===== Validate fullName =====
    if (typeof customerFullName !== 'string') {
      throw new BadRequestException('customerFullName must be a string');
    }
    const fullName = customerFullName.trim();
    if (fullName.length === 0) {
      throw new BadRequestException('customerFullName cannot be empty');
    }

    // ===== Validate & Transform dob =====
    if (typeof customerDob !== 'string') {
      throw new BadRequestException('customerDob must be a string');
    }

    const dobRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const dobMatch = customerDob.match(dobRegex);

    if (!dobMatch) {
      throw new BadRequestException('customerDob must be in format dd/mm/yyyy');
    }

    const [, dayStr, monthStr, yearStr] = dobMatch;
    const day = Number(dayStr);
    const month = Number(monthStr);
    const year = Number(yearStr);

    if (year >= 2010) {
      throw new BadRequestException('Customer must be born before 2010');
    }

    const dob = new Date(year, month - 1, day);
    if (
      dob.getFullYear() !== year ||
      dob.getMonth() !== month - 1 ||
      dob.getDate() !== day
    ) {
      throw new BadRequestException(`Invalid date: ${customerDob}`);
    }

    // ===== Validate & Transform phone =====
    if (typeof customerPhone !== 'string') {
      throw new BadRequestException('customerPhone must be a string');
    }

    let phone = customerPhone.replace(/[\s\-()]/g, '');

    if (!/^\+?\d+$/.test(phone)) {
      throw new BadRequestException('customerPhone must contain only digits');
    }

    if (phone.startsWith('0')) {
      phone = '+855' + phone.substring(1);
    }

    if (!phone.startsWith('+855')) {
      throw new BadRequestException('customerPhone must be a Cambodian number');
    }

    // ===== Return transformed body =====
    return {
      ...body,
      customerFullName: fullName,
      customerDob: dob,
      customerPhone: phone,
      customerNationalId: customerNationalId?.trim(),
    };
  }
}
