import { BaseEntity } from '@tenet/database';
import { IsCurrency, IsDefined, IsNotEmpty } from 'class-validator';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Product } from '../../product';
import { Applicant } from './applicant.entity';
import { LoanApplicationStatusType } from './loan-application-status.type';
import { LoanOffer } from './loan-offer.entity';

@Entity()
export class LoanApplication extends BaseEntity {
  @ManyToOne(() => Product, (product) => product.loanApplications)
  @IsNotEmpty()
  @IsDefined()
  product: Product;

  @Column('int4')
  termInMonths: number;

  @Column('enum', {
    enum: [
      'openned',
      'closed',
      'submitted',
      'approved',
      'rejected',
      'processing',
    ],
    default: ['openned'],
  })
  status: LoanApplicationStatusType;

  @Column('decimal')
  @IsCurrency()
  amount: number;

  @Column('decimal')
  @IsCurrency()
  itemValue: number;

  @OneToMany(() => Applicant, (applicant) => applicant.loanApplication, {
    cascade: true,
  })
  applicants: Applicant[];

  @OneToOne(() => LoanOffer)
  @JoinColumn()
  loanOffer: LoanOffer;
}
