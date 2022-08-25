import { IsCurrency, IsDefined, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateApplicantDto {
  @IsNotEmpty()
  @IsDefined()
  @IsUUID()
  personId: string;

  @IsCurrency()
  monthlyDebt: number;

  @IsCurrency()
  monthlyIncome: number;
}
