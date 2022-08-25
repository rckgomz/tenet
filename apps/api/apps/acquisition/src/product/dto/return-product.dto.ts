import { PartialType } from '@nestjs/mapped-types';
import { Exclude, Expose } from 'class-transformer';
import { CreateProductDto } from './create-product.dto';

@Exclude()
export class ReturnProductDto extends PartialType(CreateProductDto) {
  @Expose()
  readonly id: string;
}
