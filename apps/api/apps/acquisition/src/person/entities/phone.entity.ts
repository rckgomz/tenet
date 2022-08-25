import { BaseEntity } from '@tenet/database';
import { Transform } from 'class-transformer';
import { IsPhoneNumber } from 'class-validator';
import { Column, Entity, Index, ManyToOne } from 'typeorm';
import { Person } from './person.entity';
import { PhoneNumberType } from './PhoneNumberType';
import { PhoneType } from './PhoneType';

@Entity()
@Index(['person.id', 'value'], { unique: true })
export class PhoneNumber extends BaseEntity {
  @Column('enum', {
    enum: ['primary', 'secondary', 'sessional'],
    default: 'primary',
  })
  type: PhoneType;

  @Column('enum', { enum: ['mobile', 'home', 'business'], default: 'mobile' })
  numberType: PhoneNumberType;

  @Column('text')
  @Transform(({ value }: { value: string }) => value?.replace('-', ''))
  @IsPhoneNumber('US')
  value: string;

  @ManyToOne(() => Person, (person) => person.address)
  person: Person;
}
