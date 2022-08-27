import { faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { Person } from '../../entities/person.entity';

define(Person, () => {
  const person = new Person();

  person.firstName = faker.name.firstName();
  person.lastName = faker.name.lastName();
  person.ssn = faker.random.numeric(9);
  person.dateOfBirth = faker.date.past(20);

  return person;
});
