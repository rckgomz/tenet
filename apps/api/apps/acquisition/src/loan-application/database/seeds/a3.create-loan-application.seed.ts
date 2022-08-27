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

export class CreateLoanApplication implements Seeder {
  public async run(factory: Factory, ds: DataSource): Promise<void> {
    let i = 0;

    await Promise.all([
      factory(LoanApplication)()
        .map(async (l: LoanApplication) => {
          const product = await ds.manager.findOne(Product, {
            where: { termInMonths: 72 },
          });
          l.product = product;

          const person = await ds.manager.findOneBy(Person, { id: seed[i].id });
          const applicant = await factory(Applicant)().create({});
          applicant.person = person;
          applicant.monthlyDebt = _.toNumber(seed[i].monthlyDebt);
          applicant.monthlyIncome = _.toNumber(seed[i].monthlyIncome);
          applicant.personSnapshot = {
            ...JSON.parse(JSON.stringify(person)),
          };
          l.applicants = [applicant];

          const loanOffer = await factory(LoanOffer)().create({});
          loanOffer.monthlyPayment =
            _.toNumber(
              _.toNumber(seed[i].loanAmount) / product.termInMonths || 72,
            ) || 0;
          loanOffer.applicantFacts = {
            ...seed[i],
          };
          loanOffer.apr = faker.datatype.number({ min: 0.02, max: 0.08 });
          l.loanOffer = loanOffer;

          i++;
          return l;
        })
        .createMany(5),
      factory(LoanApplication)()
        .map(async (l: LoanApplication) => {
          const products = await ds.manager.find(Product);
          const randomProductIdx = faker.datatype.number({
            min: 1,
            max: products.length - 1,
          });
          const product = products[randomProductIdx];
          l.product = product;

          const persons = await ds.manager.find(Person);
          const randomPersonIdx = faker.datatype.number({
            min: 1,
            max: persons.length - 1,
          });
          const person = persons[randomPersonIdx];
          const applicant = await factory(Applicant)().create({});
          applicant.person = person;
          applicant.personSnapshot = {
            ...JSON.parse(JSON.stringify(person)),
          };
          l.applicants = [applicant];

          const loanOffer = await factory(LoanOffer)().create({});
          l.loanOffer = loanOffer;

          return l;
        })
        .createMany(5),
      factory(LoanApplication)()
        .map(async (l: LoanApplication) => {
          const products = await ds.manager.find(Product);
          const randomProductIdx = faker.datatype.number({
            min: 1,
            max: products.length - 1,
          });
          const product = products[randomProductIdx];
          l.product = product;

          const persons = await ds.manager.find(Person);
          const randomPersonIdx = faker.datatype.number({
            min: 1,
            max: persons.length - 1,
          });
          const person = persons[randomPersonIdx];
          const applicant = await factory(Applicant)().create({});
          applicant.person = person;
          applicant.personSnapshot = {
            ...JSON.parse(JSON.stringify(person)),
          };
          l.applicants = [applicant];

          const loanOffer = await factory(LoanOffer)().create({});
          l.loanOffer = loanOffer;

          return l;
        })
        .createMany(5, { status: 'closed' }),
      factory(LoanApplication)()
        .map(async (l: LoanApplication) => {
          const products = await ds.manager.find(Product);
          const randomProductIdx = faker.datatype.number({
            min: 1,
            max: products.length - 1,
          });
          const product = products[randomProductIdx];
          l.product = product;

          const persons = await ds.manager.find(Person);
          const randomPersonIdx = faker.datatype.number({
            min: 1,
            max: persons.length - 1,
          });
          const person = persons[randomPersonIdx];
          const applicant = await factory(Applicant)().create({});
          applicant.person = person;
          applicant.personSnapshot = {
            ...JSON.parse(JSON.stringify(person)),
          };
          l.applicants = [applicant];

          const loanOffer = await factory(LoanOffer)().create({});
          l.loanOffer = loanOffer;

          return l;
        })
        .createMany(5, { status: 'approved' }),
      factory(LoanApplication)()
        .map(async (l: LoanApplication) => {
          const products = await ds.manager.find(Product);
          const randomProductIdx = faker.datatype.number({
            min: 1,
            max: products.length - 1,
          });
          const product = products[randomProductIdx];
          l.product = product;

          const persons = await ds.manager.find(Person);
          const randomPersonIdx = faker.datatype.number({
            min: 1,
            max: persons.length - 1,
          });
          const person = persons[randomPersonIdx];
          const applicant = await factory(Applicant)().create({});
          applicant.person = person;
          applicant.personSnapshot = {
            ...JSON.parse(JSON.stringify(person)),
          };
          l.applicants = [applicant];

          const loanOffer = await factory(LoanOffer)().create({});
          l.loanOffer = loanOffer;

          return l;
        })
        .createMany(5, { status: 'processing' }),
      factory(LoanApplication)()
        .map(async (l: LoanApplication) => {
          const products = await ds.manager.find(Product);
          const randomProductIdx = faker.datatype.number({
            min: 1,
            max: products.length - 1,
          });
          const product = products[randomProductIdx];
          l.product = product;

          const persons = await ds.manager.find(Person);
          const randomPersonIdx = faker.datatype.number({
            min: 1,
            max: persons.length - 1,
          });
          const person = persons[randomPersonIdx];
          const applicant = await factory(Applicant)().create({});
          applicant.person = person;
          applicant.personSnapshot = {
            ...JSON.parse(JSON.stringify({})),
          };
          l.applicants = [applicant];

          const loanOffer = await factory(LoanOffer)().create({});
          l.loanOffer = loanOffer;

          return l;
        })
        .createMany(5, { status: 'rejected' }),
    ]);
  }
}
