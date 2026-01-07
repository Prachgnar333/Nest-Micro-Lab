// orders/dto/create-order.dto.ts
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsArray,
  ValidateNested,
  Min,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';

class OrderItemDto {
  @IsUUID()
  productId: string;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsNumber()
  @Min(0)
  price: number;
}

export class CreateOrderDto {
  // ===== Customer Information (will be verified) =====
  @IsString()
  @IsNotEmpty()
  customerFullName: string;

  @IsString()
  @IsNotEmpty()
  customerDob: string; // Format: dd/mm/yyyy

  @IsString()
  @IsNotEmpty()
  customerPhone: string;

  @IsString()
  customerNationalId?: string;

  // ===== Order Items =====
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  // ===== Optional Order Info =====
  @IsString()
  shippingAddress?: string;

  @IsString()
  notes?: string;
}
