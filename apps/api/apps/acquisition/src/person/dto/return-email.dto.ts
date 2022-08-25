import { PartialType } from '@nestjs/mapped-types';
import { Exclude, Expose, Type } from 'class-transformer';
import { CreateEmailDto } from './create-email.dto';

@Exclude()
class ReturnPersonDto {
  @Expose()
  id: string;
  @Expose()
  firstName: string;
  @Expose()
  lastName: string;
}

@Exclude()
export class ReturnEmailDto extends PartialType(CreateEmailDto) {
  @Expose()
  id: string;

  @Expose()
  @Type(() => ReturnPersonDto)
  person: ReturnPersonDto;
}
