import { DataSource } from 'typeorm';
import { Seeder, Factory } from 'typeorm-seeding';
import { Address } from '../../../person/entities/address.entity';
import { Email } from '../../../person/entities/email.entity';
import { Person } from '../../../person/entities/person.entity';
import { PhoneNumber } from '../../../person/entities/phone.entity';
import { seedData as seed } from '../../../database/seed';

export class CreatePerson implements Seeder {
  public async run(factory: Factory, ds: DataSource): Promise<void> {
    await Promise.all([
      ...seed.map((s) => ds.manager.delete(Email, { person: { id: s.id } })),
      ...seed.map((s) =>
        ds.manager.delete(PhoneNumber, { person: { id: s.id } }),
      ),
      ...seed.map((s) => ds.manager.delete(Address, { person: { id: s.id } })),
    ]);
    await Promise.all(seed.map((s) => ds.manager.delete(Person, s.id)));

    let i = 0;
    await factory(Person)()
      .map(async (f: Person) => {
        f.id = seed[i].id;
        f.firstName = seed[i].firstName;
        i++;

        const email = await factory(Email)().create({});
        const phoneNumber = await factory(PhoneNumber)().create({});
        const address = await factory(Address)().create({});

        f.emails = [email];
        f.phoneNumbers = [phoneNumber];
        f.address = [address];

        return f;
      })
      .createMany(5);

    await factory(Person)()
      .map(async (p: Person) => {
        const email = await factory(Email)().create({});
        const phoneNumber = await factory(PhoneNumber)().create({});
        const address = await factory(Address)().create({});

        p.emails = [email];
        p.phoneNumbers = [phoneNumber];
        p.address = [address];

        return p;
      })
      .createMany(5);
  }
}
