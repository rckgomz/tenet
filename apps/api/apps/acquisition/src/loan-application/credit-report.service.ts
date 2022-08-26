import { Injectable } from '@nestjs/common';
import { faker } from '@faker-js/faker';

@Injectable()
export class CreditReportService {
  getCreditInfo(ssn: string) {
    return {
      ssn,
      creditScore: faker.datatype.number({ min: 300, max: 850 }),
      bankruptcies: faker.datatype.number({ min: 0, max: 5 }),
      delinquencies: faker.datatype.number({ min: 0, max: 5 }),
    };
  }
}
