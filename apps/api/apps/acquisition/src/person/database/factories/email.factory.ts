import { faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { Email } from '../../entities/email.entity';

define(Email, () => {
  const email = new Email();

  email.id = faker.datatype.uuid();
  email.value = faker.internet.exampleEmail();
  email.type = 'primary';

  return email;
});
