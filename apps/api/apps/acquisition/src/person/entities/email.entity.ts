import { BaseEntity } from '@tenet/database';
import { IsEmail } from 'class-validator';
import { Column, Entity, Index, ManyToOne } from 'typeorm';
import { EmailType } from './email.type';
import { Person } from './person.entity';

@Entity()
@Index(['person.id', 'email'], { unique: true })
export class Email extends BaseEntity {
  @Column('enum', {
    enum: ['primary', 'secondary', 'business'],
    default: 'primary',
  })
  type: EmailType;

  @Column('text')
  @IsEmail()
  email: string;

  @ManyToOne(() => Person, (person) => person.emails)
  person: Person;
}
