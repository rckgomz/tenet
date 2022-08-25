import { BaseEntity } from '@tenet/database';
import { IsCurrency } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { Product } from '../../product';
import { LoanApplicationStatusType } from './loan-application-status.type';
import { LoanOffer } from './loan-offer.entity';

@Entity()
export class LoanApplication extends BaseEntity {
  @ManyToOne(() => Product, (product) => product.loanApplications)
  product: Product;

  @Column('enum', {
    enum: ['openned', 'closed', 'submitted', 'approved', 'rejected'],
    default: ['openned'],
  })
  status: LoanApplicationStatusType;

  @IsCurrency()
  amount: number;

  @IsCurrency()
  itemValue: number;

  @OneToOne(() => LoanOffer)
  @JoinColumn()
  loanOffer: LoanOffer;
}
