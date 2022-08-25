import { BaseEntity } from '@tenet/database';
import { Column, Entity, ManyToOne } from 'typeorm';
import { AddressType } from './address.type';
import { Person } from './person.entity';

@Entity()
export class Address extends BaseEntity {
  @Column('enum', {
    enum: ['primary', 'secondary', 'mailing', 'seassoning'],
    default: 'primary',
  })
  type: AddressType;

  @Column('text')
  addressLine1: string;

  @Column('text', { nullable: true })
  addressLine2?: string;

  @Column('text')
  city: string;

  @Column('varchar', { length: 2 })
  state: string;

  @Column('varchar', { length: 9 })
  zipCode: string;

  @ManyToOne(() => Person, (person) => person.address)
  person: Person;
}
