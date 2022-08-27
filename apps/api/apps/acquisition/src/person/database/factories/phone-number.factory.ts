import { faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { PhoneNumber } from '../../entities/phone.entity';

define(PhoneNumber, () => {
  const phoneNumber = new PhoneNumber();

  phoneNumber.id = faker.datatype.uuid();
  phoneNumber.value = faker.phone.number('##########');
  phoneNumber.type = 'primary';

  return phoneNumber;
});
