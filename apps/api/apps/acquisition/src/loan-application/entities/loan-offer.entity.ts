import { BaseEntity } from '@tenet/database';
import { IsJSON } from 'class-validator';
import { Column, Entity } from 'typeorm';

@Entity()
export class LoanOffer extends BaseEntity {
  @Column('decimal')
  apr: number;

  @Column('decimal')
  monthlyPayment: number;

  @Column('boolean')
  accepted: boolean;

  @Column('jsonb')
  @IsJSON()
  applicantFacts: any;

  @Column('jsonb')
  @IsJSON()
  reason: any;
}
