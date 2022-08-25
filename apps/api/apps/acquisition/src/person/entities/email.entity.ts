import { BaseEntity } from '@tenet/database';
import { Transform } from 'class-transformer';
import { IsEmail } from 'class-validator';
import { Column, Entity, Index, ManyToOne } from 'typeorm';
import { EmailType } from './email.type';
import { Person } from './person.entity';

@Entity()
@Index(['person.id', 'value'], { unique: true })
export class Email extends BaseEntity {
  @Column('enum', {
    enum: ['primary', 'secondary', 'business'],
    default: 'primary',
  })
  type: EmailType;

  @Column('text')
  @Transform(({ value }: { value: string }) => value?.toLowerCase())
  @IsEmail()
  value: string;

  @ManyToOne(() => Person, (person) => person.emails)
  person: Person;
}
