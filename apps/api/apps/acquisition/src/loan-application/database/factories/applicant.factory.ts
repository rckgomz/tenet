import { faker } from '@faker-js/faker';
import * as _ from 'lodash';
import { define } from 'typeorm-seeding';
import { Applicant } from '../../entities/applicant.entity';

define(Applicant, () => {
  const applicant = new Applicant();

  applicant.id = faker.datatype.uuid();
  applicant.monthlyDebt = _.toNumber(faker.commerce.price(1000, 13000));
  applicant.monthlyIncome = _.toNumber(faker.commerce.price(5000, 20000));
  applicant.personSnapshot = {};

  return applicant;
});
