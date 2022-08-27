import { Person } from 'apps/acquisition/src/person/entities/person.entity';
import { DataSource } from 'typeorm';
import * as _ from 'lodash';
import { Seeder, Factory } from 'typeorm-seeding';
import { Applicant } from '../../entities/applicant.entity';
import { LoanApplication } from '../../entities/loan-application.entity';
import { LoanOffer } from '../../entities/loan-offer.entity';
import { seedData as seed } from '../../../database/seed';
import { faker } from '@faker-js/faker';
import { Product } from 'apps/acquisition/src/product/entities/product.entity';
import { setDefaultResultOrder } from 'dns';

export class CreateLoanApplication implements Seeder {
  public async run(factory: Factory, ds: DataSource): Promise<void> {
    let i = 0;

    Promise.all([
      factory(LoanApplication)()
        .map(async (l: LoanApplication) => {
          const product = await ds.manager.findOne(Product, {
            where: { termInMonths: 72 },
          });
          const person = await ds.manager.findOneBy(Person, { id: seed[i].id });

          const applicant = await factory(Applicant)().create({});
          applicant.person = person;
          applicant.monthlyDebt = _.toNumber(seed[i].monthlyDebt);
          applicant.monthlyIncome = _.toNumber(seed[i].monthlyIncome);
          applicant.personSnapshot = {
            ...JSON.parse(JSON.stringify({})),
            ...seed[i],
          };

          l.applicants = [applicant];

          const loanOffer = await factory(LoanOffer)().create({
            monthlyPayment: _.toNumber(_.toNumber(seed[i].loanAmount) / 72),
            applicantFacts: seed[i],
            apr: faker.datatype.number({ min: 0.02, max: 0.08 }),
          });

          l.loanOffer = loanOffer;

          l.product = product;

          i++;
          return l;
        })
        .createMany(5),
      factory(LoanApplication)().createMany(5),
      factory(LoanApplication)().createMany(5, { status: 'closed' }),
      factory(LoanApplication)().createMany(5, { status: 'approved' }),
      factory(LoanApplication)().createMany(5, { status: 'processing' }),
      factory(LoanApplication)().createMany(5, { status: 'rejected' }),
    ]);
  }
}
