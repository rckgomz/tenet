import { faker } from '@faker-js/faker';
import * as _ from 'lodash';
import { define } from 'typeorm-seeding';
import { LoanOffer } from '../../entities/loan-offer.entity';

define(LoanOffer, () => {
  const loanOffer = new LoanOffer();

  loanOffer.id = faker.datatype.uuid();
  loanOffer.apr = 0.02;
  loanOffer.accepted = false;
  loanOffer.reason = {};
  loanOffer.applicantFacts = {};
  loanOffer.monthlyPayment = _.toNumber(faker.commerce.price(1000, 5000));

  return loanOffer;
});
