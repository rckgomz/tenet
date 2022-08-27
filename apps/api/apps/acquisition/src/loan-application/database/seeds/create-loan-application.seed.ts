import { Person } from 'apps/acquisition/src/person/entities/person.entity';
import { DataSource } from 'typeorm';
import * as _ from 'lodash';
import { Seeder, Factory } from 'typeorm-seeding';
import { Applicant } from '../../entities/applicant.entity';
import { LoanApplication } from '../../entities/loan-application.entity';

export class CreateLoanApplication implements Seeder {
  public async run(factory: Factory, ds: DataSource): Promise<void> {
    const seed = [
      {
        id: 'fb414ddc-6e3b-4859-bb45-56d7389a64ba',
        score: '802',
        monthlyDebt: '13000.00',
        monthlyIncome: '20000.00',
        bankruptcies: 0,
        deliquency: 0,
        vehicleValue: '78000.00',
        loanAmount: '60000.00',
      },
      {
        id: '0c7sc7cd5-058a-4fa1-8d91-f5364757a11c',
        score: '765',
        monthlyDebt: '3000.00',
        monthlyIncome: '12000.00',
        bankruptcies: 0,
        deliquency: 0,
        vehicleValue: '45000.00',
        loanAmount: '30000.00',
      },
      {
        id: '48sf135fb-d7fb-4f47-b5bf-8824d8b6e525',
        score: '600',
        monthlyDebt: '1000.00',
        monthlyIncome: '5000.00',
        bankruptcies: 0,
        deliquency: 2,
        vehicleValue: '40,000.00',
        loanAmount: '45000.00',
      },
      {
        id: '9bse28a4a-77af-4b65-91f4-088d5c0cd76b',
        score: '680',
        monthlyDebt: '2000.00',
        monthlyIncome: '8000.00',
        bankruptcies: 1,
        deliquency: 1,
        vehicleValue: '52000.00',
        loanAmount: '50000.00',
      },
      {
        id: '748s56012-7e1d-11ec-82de-062205c32318',
        score: '720',
        monthlyDebt: '4000.00',
        monthlyIncome: '10000.00',
        bankruptcies: 0,
        deliquency: 0,
        vehicleValue: '50,000.00',
        loanAmount: '40,000.00',
      },
    ];
    let i = 0;

    Promise.all([
      factory(LoanApplication)()
        .map(async (l: LoanApplication) => {
          const person = await ds.manager.findOneBy(Person, { id: seed[i].id });

          const applicant = await factory(Applicant)().create({});
          applicant.person = person;
          applicant.monthlyDebt = _.toNumber(seed[i].monthlyDebt);
          applicant.monthlyIncome = _.toNumber(seed[i].monthlyIncome);

          l.applicants = [applicant];

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
