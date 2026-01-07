// modules/customers/pipes/trim.pipe.ts - FIXED
import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class TrimPipe implements PipeTransform<string, string> {
  transform(value: string): string {
    // 1. Check if value is string
    if (typeof value !== 'string') {
      throw new BadRequestException('Value must be a string');
    }

    // 2. Trim whitespace
    const trimmed = value.trim();

    // 3. Reject if result is empty
    if (trimmed.length === 0) {
      throw new BadRequestException('Value cannot be empty or only whitespace');
    }

    // 4. Return trimmed value
    return trimmed;
  }
}
