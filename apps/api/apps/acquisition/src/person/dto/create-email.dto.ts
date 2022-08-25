import { Exclude, Expose, Transform } from 'class-transformer';
import { IsEmail, IsEnum } from 'class-validator';
import { EmailType } from '../entities/email.type';

@Exclude()
export class CreateEmailDto {
  @IsEnum(['primary', 'secondary', 'business'])
  @Expose()
  type: EmailType;

  @IsEmail()
  @Expose({
    name: 'value',
  })
  @Transform(({ value }: { value: string }) => value?.toLowerCase())
  email: string;
}
