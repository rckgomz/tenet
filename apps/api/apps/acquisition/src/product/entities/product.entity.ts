import { BaseEntity } from '@tenet/database';
import { Column, Entity, OneToMany } from 'typeorm';
import { LoanApplication } from '../../loan-application/entities/loan-application.entity';
import { ProductType } from './product.type';

@Entity()
export class Product extends BaseEntity {
  @Column('text')
  name: string;

  @Column('enum', { enum: ['car', 'other'], default: 'car' })
  type?: ProductType;

  @Column('int4', { default: 72 })
  termInMonths?: number;

  @OneToMany(() => LoanApplication, (application) => application.product)
  loanApplications: LoanApplication[];
}
