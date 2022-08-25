import { BaseEntity } from '@tenet/database';
import { Column, Entity } from 'typeorm';

@Entity()
export class LoanOffer extends BaseEntity {
  @Column('decimal')
  apr: number;

  @Column('decimal')
  monthlyPayment: number;

  @Column('int4')
  termLengthMont: number;

  @Column('boolean')
  accepted: boolean;

  @Column('jsonb')
  reason: Record<string, unknown>;
}
