import { PartialType } from '@nestjs/mapped-types';
import { Exclude, Expose, Type } from 'class-transformer';
import { CreatePhoneNumberDto } from './create-phone-number.dto';

@Exclude()
class ReturnLitePersonDto {
  @Expose()
  id: string;
  @Expose()
  firstName: string;
  @Expose()
  lastName: string;
}

@Exclude()
export class ReturnPhoneNumberDto extends PartialType(CreatePhoneNumberDto) {
  @Expose()
  id: string;

  @Expose()
  @Type(() => ReturnLitePersonDto)
  person: ReturnLitePersonDto;

  @Expose()
  value: string;
}
