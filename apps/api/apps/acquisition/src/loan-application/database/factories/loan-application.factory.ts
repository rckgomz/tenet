import { faker } from '@faker-js/faker';
import * as _ from 'lodash';
import { define } from 'typeorm-seeding';
import { LoanApplication } from '../../entities/loan-application.entity';

define(LoanApplication, () => {
  const loanApplication = new LoanApplication();

  loanApplication.id = faker.datatype.uuid();
  loanApplication.amount = _.toNumber(faker.commerce.price(40000, 60000));
  loanApplication.itemValue = _.toNumber(faker.commerce.price(50000, 80000));
  loanApplication.termInMonths = 0;
  loanApplication.status = 'openned';

  return loanApplication;
});
