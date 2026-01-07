// modules/customers/pipes/verify-customer.pipe.ts
import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

interface VerifyCustomerRequest {
  fullName: string;
  dob: string;
  phone: string;
  nationalId?: string;
}

interface VerifyCustomerTransformed {
  fullName: string;
  dob: Date;
  phone: string;
  nationalId?: string;
}

@Injectable()
export class VerifyCustomerPipe implements PipeTransform<
  VerifyCustomerRequest,
  VerifyCustomerTransformed
> {
  transform(body: VerifyCustomerRequest): VerifyCustomerTransformed {
    // Validate that body is an object
    if (typeof body !== 'object' || body === null) {
      throw new BadRequestException('Request body must be an object');
    }

    // ===== 1. Validate & Transform fullName =====
    if (typeof body.fullName !== 'string') {
      throw new BadRequestException('fullName must be a string');
    }

    const fullName = body.fullName.trim();
    if (fullName.length === 0) {
      throw new BadRequestException(
        'fullName cannot be empty or only whitespace',
      );
    }

    // ===== 2. Validate & Transform dob =====
    if (typeof body.dob !== 'string') {
      throw new BadRequestException('dob must be a string');
    }

    const dobRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const dobMatch = body.dob.match(dobRegex);

    if (!dobMatch) {
      throw new BadRequestException(
        'dob must be in format dd/mm/yyyy (e.g., 25/12/2005)',
      );
    }

    const [, dayStr, monthStr, yearStr] = dobMatch;
    const day = Number(dayStr);
    const month = Number(monthStr);
    const year = Number(yearStr);

    // Check year constraint
    if (year >= 2010) {
      throw new BadRequestException(
        'Customer must be born before 2010 (year < 2010)',
      );
    }

    // Validate real calendar date
    const dob = new Date(year, month - 1, day);
    if (
      dob.getFullYear() !== year ||
      dob.getMonth() !== month - 1 ||
      dob.getDate() !== day
    ) {
      throw new BadRequestException(
        `Invalid date: ${body.dob} (day/month out of range)`,
      );
    }

    // ===== 3. Validate & Transform phone =====
    if (typeof body.phone !== 'string') {
      throw new BadRequestException('phone must be a string');
    }

    // Remove spaces, dashes, parentheses
    let phone = body.phone.replace(/[\s\-()]/g, '');

    // Check if contains only digits and optional leading +
    if (!/^\+?\d+$/.test(phone)) {
      throw new BadRequestException(
        'phone must contain only digits and optionally start with +',
      );
    }

    // Convert 0XX to +855XX
    if (phone.startsWith('0')) {
      phone = '+855' + phone.substring(1);
    }

    // Ensure it starts with +
    if (!phone.startsWith('+')) {
      throw new BadRequestException(
        'phone must start with country code (e.g., +855) or 0',
      );
    }

    // Validate Cambodia format
    if (!phone.startsWith('+855')) {
      throw new BadRequestException(
        'phone must be a valid Cambodian number (+855 or starting with 0)',
      );
    }

    const digitsAfter855 = phone.substring(4);
    if (digitsAfter855.length < 8 || digitsAfter855.length > 10) {
      throw new BadRequestException('phone must have 8-10 digits after +855');
    }

    // ===== 4. Optional nationalId validation =====
    let nationalId: string | undefined = body.nationalId;

    if (nationalId !== undefined) {
      if (typeof nationalId !== 'string') {
        throw new BadRequestException('nationalId must be a string');
      }

      nationalId = nationalId.trim();

      // Simple pattern check: alphanumeric, 5-20 characters
      if (!/^[A-Za-z0-9-]{5,20}$/.test(nationalId)) {
        throw new BadRequestException(
          'nationalId must be 5-20 alphanumeric characters (may include dashes)',
        );
      }
    }

    // ===== Return transformed object =====
    return {
      fullName,
      dob,
      phone,
      nationalId,
    };
  }
}
