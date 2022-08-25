import { BaseEntity } from '@tenet/database';
import { IsCurrency, IsDefined, IsNotEmpty } from 'class-validator';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Person } from '../../person/entities';
import { LoanApplication } from './loan-application.entity';

@Entity()
export class Applicant extends BaseEntity {
  @ManyToOne(() => Person, (person) => person.applicants)
  @IsNotEmpty()
  @IsDefined()
  person: Person;

  @Column('decimal')
  @IsCurrency()
  monthlyDebt: number;

  @Column('decimal')
  @IsCurrency()
  monthlyIncome: number;

  @Column('json')
  personSnapshot: Record<string, unknown>;

  @ManyToOne(() => LoanApplication, (appl) => appl.applicants)
  loanApplication: LoanApplication;
}
