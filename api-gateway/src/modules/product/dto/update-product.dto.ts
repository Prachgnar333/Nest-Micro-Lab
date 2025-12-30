import {
  IsNumber,
  IsString,
  IsUUID,
  Min,
  MinLength,
  IsOptional,
} from 'class-validator';

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;

  @IsOptional()
  @IsNumber()
  @Min(0.01)
  price?: number;

  @IsOptional()
  @IsString()
  sku?: string;

  @IsOptional()
  @IsUUID()
  categoryId?: string;
}
