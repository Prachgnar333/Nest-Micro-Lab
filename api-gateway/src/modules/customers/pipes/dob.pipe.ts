// modules/customers/pipes/dob.pipe.ts
import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class DobPipe implements PipeTransform<string, Date> {
  transform(value: string): Date {
    // 1. Check if value is string
    if (typeof value !== 'string') {
      throw new BadRequestException('dob must be a string');
    }

    // 2. Validate format: dd/mm/yyyy
    const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const match = value.match(regex);

    if (!match) {
      throw new BadRequestException(
        'dob must be in format dd/mm/yyyy (e.g., 25/12/2005)',
      );
    }

    const [, dayStr, monthStr, yearStr] = match;
    const day = Number(dayStr);
    const month = Number(monthStr);
    const year = Number(yearStr);

    // 3. Check year constraint (must be < 2010)
    if (year >= 2010) {
      throw new BadRequestException(
        'Customer must be born before 2010 (year < 2010)',
      );
    }

    // 4. Validate the date is actually valid (real calendar date)
    const date = new Date(year, month - 1, day); // month is 0-indexed in JS

    // Check if date is valid (e.g., 31/02/2000 would be invalid)
    if (
      date.getFullYear() !== year ||
      date.getMonth() !== month - 1 ||
      date.getDate() !== day
    ) {
      throw new BadRequestException(
        `Invalid date: ${value} (day/month out of range)`,
      );
    }

    // 5. Return transformed Date object
    return date;
  }
}
