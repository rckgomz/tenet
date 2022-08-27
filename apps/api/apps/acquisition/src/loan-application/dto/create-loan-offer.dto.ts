import { IsCurrency, IsJSON } from 'class-validator';

export class CreateLoanOfferDto {
  apr: number;

  @IsCurrency()
  monthlyPayment: number;

  accepted: boolean;

  @IsJSON()
  applicantFacts: any[];

  @IsJSON()
  reason: any[];
}
