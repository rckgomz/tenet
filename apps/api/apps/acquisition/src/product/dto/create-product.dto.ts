import { Exclude, Expose } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ProductType } from '../entities/product.type';

@Exclude()
export class CreateProductDto {
  @IsString()
  @Expose()
  name: string;

  @IsEnum(['car', 'others'])
  @Expose()
  @IsOptional()
  type?: ProductType;

  @Expose()
  @IsOptional()
  termInMonths: number;
}
