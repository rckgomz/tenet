import { Seeder, Factory } from 'typeorm-seeding';
import { LoanApplication } from '../../entities/loan-application.entity';

export class CreatePerson implements Seeder {
  public async run(factory: Factory): Promise<void> {
    Promise.all([
      factory(LoanApplication)().createMany(5),
      factory(LoanApplication)().createMany(5, { status: 'closed' }),
      factory(LoanApplication)().createMany(5, { status: 'approved' }),
      factory(LoanApplication)().createMany(5, { status: 'processing' }),
      factory(LoanApplication)().createMany(5, { status: 'rejected' }),
    ]);
  }
}
