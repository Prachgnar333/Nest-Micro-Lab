// modules/customers/blocked-customer.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class BlockedCustomerService {
  // Blocked lists (in-memory for lab)
  private blockedCustomerIds = new Set<string>([
    'BLOCKED-001',
    'BLOCKED-002',
    'BLOCKED-003',
  ]);

  private blockedPhones = new Set<string>([
    '+85599999999',
    '+85588888888',
    '+85577777777',
  ]);

  private blockedNationalIds = new Set<string>([
    'BAD-ID-001',
    'BAD-ID-002',
    'FRAUD-123',
  ]);

  private blockedNames = new Set<string>([
    'John Scammer',
    'Fraud Person',
    'Bad Actor',
  ]);

  // ✅ Check if customer ID is blocked
  isBlocked(customerId: string): boolean {
    return this.blockedCustomerIds.has(customerId);
  }

  // ✅ Check if phone is blocked
  isBlockedPhone(phone: string): boolean {
    return this.blockedPhones.has(phone);
  }

  // ✅ Check if national ID is blocked
  isBlockedNationalId(nationalId?: string): boolean {
    if (!nationalId) return false;
    return this.blockedNationalIds.has(nationalId);
  }

  // ✅ Check if name is blocked
  isBlockedName(name: string): boolean {
    return this.blockedNames.has(name);
  }

  // Management methods
  blockCustomer(customerId: string): void {
    this.blockedCustomerIds.add(customerId);
  }

  unblockCustomer(customerId: string): void {
    this.blockedCustomerIds.delete(customerId);
  }

  blockPhone(phone: string): void {
    this.blockedPhones.add(phone);
  }

  unblockPhone(phone: string): void {
    this.blockedPhones.delete(phone);
  }

  getBlockedList() {
    return {
      customerIds: Array.from(this.blockedCustomerIds),
      phones: Array.from(this.blockedPhones),
      nationalIds: Array.from(this.blockedNationalIds),
      names: Array.from(this.blockedNames),
    };
  }
}
