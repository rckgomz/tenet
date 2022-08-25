import { Type } from 'class-transformer';
import { IsCurrency, IsUUID, ValidateNested } from 'class-validator';
import { CreateApplicantDto } from './create-applicant.dto';

export class CreateLoanApplicationDto {
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
