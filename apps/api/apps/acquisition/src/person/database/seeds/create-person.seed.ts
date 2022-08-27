import { DataSource } from 'typeorm';
import { Seeder, Factory } from 'typeorm-seeding';
import { Person } from '../../entities/person.entity';

export class CreatePerson implements Seeder {
  public async run(factory: Factory, ds: DataSource): Promise<void> {
    // await ds.manager.clear(Person);
    const seed = [
      { id: 'fb414ddc-6e3b-4859-bb45-56d7389a64ba', firstName: 'Adam' },
      { id: '0c7c7cd5-058a-4fa1-8d91-f5364757a11c', firstName: 'Barry' },
      { id: '48f135fb-d7fb-4f47-b5bf-8824d8b6e525', firstName: 'Cindy' },
      { id: '9be28a4a-77af-4b65-91f4-088d5c0cd76b', firstName: 'David' },
      { id: '74856012-7e1d-11ec-82de-062205c32318', firstName: 'Ezra' },
    ];

    await Promise.all(seed.map((s) => ds.manager.delete(Person, s.id)));

    let i = 0;
    await factory(Person)()
      .map(async (f: Person) => {
        f.id = seed[i].id;
        f.firstName = seed[i].firstName;
        i++;

        return f;
      })
      .createMany(5);

    await factory(Person)().createMany(5);
  }
}
