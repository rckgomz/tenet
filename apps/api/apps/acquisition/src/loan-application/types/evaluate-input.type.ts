import { IsCurrency, IsNumber, Length } from 'class-validator';

export class EvaluateInputType {
  @IsNumber()
  creditScore: number;

  @IsCurrency()
  monthlyDebt: number;

  @IsCurrency()
  monthlyIncome: number;

  @IsNumber()
  @Length(0, 5)
  bankruptcies: number;

  @IsNumber()
  @Length(0, 5)
  delinquencies: number;

  @IsCurrency()
  itemValue: number;

  @IsCurrency()
  loanAmount: number;

  @IsCurrency()
  loanPaymentAmount: number;

  apr: number;

  termInMonths: number;
}
