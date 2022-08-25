import { BaseEntity } from '@tenet/database';
import { Column, Entity, OneToMany } from 'typeorm';
import { LoanApplication } from '../../loan-application';
import { ProductType } from './product.type';

@Entity()
export class Product extends BaseEntity {
  @Column('text')
  name: string;

  @Column('enum', { enum: ['car', 'other'], default: 'car' })
  type: ProductType;

  @OneToMany(() => LoanApplication, (application) => application.product)
  loanApplications: LoanApplication[];
}
