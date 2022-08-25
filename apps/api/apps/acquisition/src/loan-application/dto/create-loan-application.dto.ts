import { Type } from 'class-transformer';
import {
  IsCurrency,
  IsDefined,
  IsNotEmpty,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { CreateApplicantDto } from './create-applicant.dto';

export class CreateLoanApplicationDto {
  @IsNotEmpty()
  @IsDefined()
  @IsUUID()
  productId: string;

  @Type(() => CreateApplicantDto)
  @ValidateNested()
  applicants: CreateApplicantDto[];

  @IsCurrency()
  amount: number;

  @IsCurrency()
  itemValue: number;
}
