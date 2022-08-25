import {
  IsDate,
  IsEmail,
  IsMobilePhone,
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
  primaryEmail: string;

  @IsMobilePhone('us')
  primaryPhoneNumber: string;

  @IsOptional()
  primaryAddress: {
    addressLine1: string;
  };
}
