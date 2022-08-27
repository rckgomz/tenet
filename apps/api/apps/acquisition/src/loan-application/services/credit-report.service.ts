import { Injectable } from '@nestjs/common';
import { faker } from '@faker-js/faker';
import { CreditReportType } from '../types/credit-report-type';

@Injectable()
export class CreditReportService {
  /**
   * Generate a faker create report
   * @param ssn {string} social security number
   * @returns {{ssn: string, creditScore: number, bankruptcies: number, delinquencies: number  }} a credit report
   */
  getCreditInfo(ssn: string): CreditReportType {
    return {
      ssn,
      creditScore: faker.datatype.number({ min: 300, max: 850 }),
      bankruptcies: faker.datatype.number({ min: 0, max: 5 }),
      delinquencies: faker.datatype.number({ min: 0, max: 5 }),
    };
  }
}
