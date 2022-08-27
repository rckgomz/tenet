import { faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { Address } from '../../entities/address.entity';

define(Address, () => {
  const address = new Address();

  const state = faker.address.stateAbbr();

  address.id = faker.datatype.uuid();
  address.type = 'primary';
  address.addressLine1 = faker.address.streetAddress();
  address.city = faker.address.city();
  address.state = state;
  address.zipCode = faker.address.zipCodeByState(state);

  return address;
});
