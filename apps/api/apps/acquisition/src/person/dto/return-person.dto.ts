import { PartialType } from '@nestjs/mapped-types';
import { Exclude, Expose } from 'class-transformer';
import { CreatePersonDto } from './create-person.dto';

@Exclude()
export class ReturnPersonDto extends PartialType(CreatePersonDto) {
  @Expose()
  readonly id: string;
}
