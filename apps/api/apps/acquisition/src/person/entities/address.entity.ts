import { BaseEntity } from '@tenet/database';
import { IsPostalCode, Matches } from 'class-validator';
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
  @Matches(
    /^((A[LKSZR])|(C[AOT])|(D[EC])|(F[ML])|(G[AU])|(HI)|(I[DLNA])|(K[SY])|(LA)|(M[EHDAINSOT])|(N[EVHJMYCD])|(MP)|(O[HKR])|(P[WAR])|(RI)|(S[CD])|(T[NX])|(UT)|(V[TIA])|(W[AVIY]))$/gm,
  )
  state: string;

  @Column('varchar', { length: 9 })
  @IsPostalCode('US')
  zipCode: string;

  @ManyToOne(() => Person, (person) => person.address)
  person: Person;
}
