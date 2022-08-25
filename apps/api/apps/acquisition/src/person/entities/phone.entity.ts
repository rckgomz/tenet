import { BaseEntity } from '@tenet/database';
import { Column, Entity, Index, ManyToOne } from 'typeorm';
import { Person } from './person.entity';
import { PhoneNumberType } from './PhoneNumberType';
import { PhoneType } from './PhoneType';

@Entity()
@Index(['person.id', 'number'], { unique: true })
export class PhoneNumber extends BaseEntity {
  @Column('enum', {
    enum: ['primary', 'secondary', 'sessional'],
    default: 'primary',
  })
  type: PhoneType;

  @Column('enum', { enum: ['mobile', 'home', 'business'], default: 'mobile' })
  numberType: PhoneNumberType;

  @Column('text')
  number: string;

  @ManyToOne(() => Person, (person) => person.address)
  person: Person;
}
