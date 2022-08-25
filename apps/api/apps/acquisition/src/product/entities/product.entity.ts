import { BaseEntity } from '@tenet/database';
import { Column, Entity } from 'typeorm';
import { ProductType } from './product.type';

@Entity()
export class Product extends BaseEntity {
  @Column('text')
  name: string;

  @Column('enum', { enum: ['car', 'other'], default: 'car' })
  type: ProductType;
}
