import { Exclude, Expose } from 'class-transformer';
import { IsEnum } from 'class-validator';
import { PhoneNumberType } from '../entities/PhoneNumberType';

@Exclude()
export class CreatePhoneNumberDto {
  @IsEnum(['primary', 'secondary', 'business'])
  @Expose()
  type: PhoneNumberType;

  @Expose({
    name: 'value',
  })
  number: string;
}
