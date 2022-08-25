import { BaseEntity } from '@tenet/database';
import { IsCurrency, IsDefined, IsNotEmpty } from 'class-validator';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Person } from '../../person/entities/person.entity';
import { LoanApplication } from './loan-application.entity';

@Entity()
export class Applicant extends BaseEntity {
  @ManyToOne(() => Person, (person) => person.applicants)
  @IsNotEmpty()
  @IsDefined()
  person: Person;

  @Column('decimal')
  @IsCurrency()
  monthltyDebt: number;

  @Column('decimal')
  @IsCurrency()
  monthlyIncome: number;

  @Column('json')
  personSnapshot: Person;

  @ManyToOne(() => LoanApplication, (appl) => appl.applicants)
  loanApplication: LoanApplication;
}
