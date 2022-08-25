import { Exclude, Expose, Transform } from 'class-transformer';
import { IsEnum, IsPhoneNumber } from 'class-validator';
import { PhoneNumberType } from '../types';

@Exclude()
export class CreatePhoneNumberDto {
  @IsEnum(['primary', 'secondary', 'business'])
  @Expose()
  type: PhoneNumberType;

  @Expose()
  @Transform(({ value }: { value: string }) => value?.replace('-', ''))
  @IsPhoneNumber('US')
  number: string;
}
