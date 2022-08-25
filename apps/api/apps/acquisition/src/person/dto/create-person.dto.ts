import { Transform } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsPhoneNumber,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreatePersonDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsNumberString()
  @IsOptional()
  ssn: string;

  @IsDate()
  @IsOptional()
  dateOfBirth: Date;

  @IsEmail()
  @Transform(({ value }: { value: string }) => value.toLowerCase())
  primaryEmail: string;

  // @IsPhoneNumber('US')
  primaryPhoneNumber: string;

  @IsOptional()
  primaryAddress: {
    addressLine1: string;
  };
}
