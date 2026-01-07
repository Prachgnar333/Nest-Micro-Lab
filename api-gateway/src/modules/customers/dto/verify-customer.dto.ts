// modules/customers/dto/verify-customer.dto.ts

export interface VerifyCustomerDto {
  fullName: string;
  dob: string; // Will be validated by DobPipe
  phone: string; // Will be validated by PhonePipe
  nationalId?: string; // Optional
}
