// modules/product/dto/create-product.dto.ts
import { IsNumber, IsString, IsUUID, Min, MinLength } from 'class-validator';

export class CreateProductDto {
  // ✅ Add 'export'
  @IsString()
  @MinLength(2)
  name: string;

  @IsNumber()
  @Min(0.01)
  price: number;

  @IsString()
  sku: string;

  @IsUUID()
  categoryId: string;
}
