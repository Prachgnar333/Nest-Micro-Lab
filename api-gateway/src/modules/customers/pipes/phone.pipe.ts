import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class PhonePipe implements PipeTransform<string, string> {
  transform(value: string): string {
    // 1. Check if value is string
    if (typeof value !== 'string') {
      throw new BadRequestException('phone must be a string');
    }

    // 2. Remove all whitespace and dashes for validation
    const cleaned = value.replace(/[\s-]/g, '');

    // 3. Simple validation: 10-15 digits, optionally starting with +
    const phoneRegex = /^\+?\d{10,15}$/;
    if (!phoneRegex.test(cleaned)) {
      throw new BadRequestException(
        'phone must be 10-15 digits, optionally starting with + (e.g., +855123456789 or 0123456789)',
      );
    }

    // 4. Return normalized phone (cleaned format)
    return cleaned;
  }
}
