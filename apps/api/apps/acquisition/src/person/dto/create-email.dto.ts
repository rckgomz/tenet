import { Exclude, Expose, Transform } from 'class-transformer';
import { IsEmail, IsEnum } from 'class-validator';
import { EmailType } from '../types';

@Exclude()
export class CreateEmailDto {
  @IsEnum(['primary', 'secondary', 'business'])
  @Expose()
  type: EmailType;

  @Transform(({ value }: { value: string }) => value?.toLowerCase())
  @IsEmail()
  @Expose()
  email: string;
}
