import { IsCurrency, IsUUID } from 'class-validator';

export class CreateApplicantDto {
  @IsUUID()
  personId: string;

  @IsCurrency()
  monthlyDebt: number;

  @IsCurrency()
  monthlyIncome: number;
}
