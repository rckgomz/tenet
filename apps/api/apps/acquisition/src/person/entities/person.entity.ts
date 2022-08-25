import { BaseEntity } from '@tenet/database';
import { Column, Entity, Index, OneToMany } from 'typeorm';
import { Address } from './address.entity';
import { PhoneNumber } from './phone.entity';

@Entity()
export class Person extends BaseEntity {
  @Column('text')
  firstName: string;

  @Column('text')
  lastName: string;

  @Column('varchar', { length: 9 })
  @Index({ unique: true })
  ssn: string;

  @OneToMany(() => Address, (address) => address.person)
  address: Address[];

  @OneToMany(() => PhoneNumber, (phoneNumber) => phoneNumber.person)
  phoneNumbers: PhoneNumber[];
}
