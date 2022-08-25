import { BaseEntity } from '@tenet/database';
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

  @OneToOne(() => LoanOffer)
  @JoinColumn()
  loanOffer: LoanOffer;
}
