import { Exclude, Expose, Transform } from 'class-transformer';
import { IsEnum } from 'class-validator';
import { EmailType } from '../entities/email.type';

@Exclude()
export class CreatePhoneNumberDto {
  @IsEnum(['primary', 'secondary', 'business'])
  @Expose()
  type: EmailType;

  @Expose({
    name: 'value',
  })
  @Transform(({ value }: { value: string }) => value?.toLowerCase())
  value: string;
}
