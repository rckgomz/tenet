import { Exclude, Expose, Transform } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsPhoneNumber,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

@Exclude()
export class CreatePersonDto {
  @Expose()
  @IsString()
  readonly firstName: string;

  @IsString()
  @Expose()
  readonly lastName: string;

  @IsNumberString()
  @IsOptional()
  @Expose()
  readonly ssn: string;

  @IsDate()
  @IsOptional()
  @Expose()
  readonly dateOfBirth: Date;

  @IsEmail()
  @Expose()
  @Transform(({ value }: { value: string }) => value?.toLowerCase())
  readonly primaryEmail: string;

  // @IsPhoneNumber('US')
  @Expose()
  readonly primaryPhoneNumber: string;

  @IsOptional()
  @Expose()
  readonly primaryAddress: {
    addressLine1: string;
  };
}
