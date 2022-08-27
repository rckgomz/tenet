import { Test, TestingModule } from '@nestjs/testing';
import { Event } from 'json-rules-engine';
import * as _ from 'lodash';
import { EvaluateInputType } from '../types/evaluate-input.type';
import { DesicionMakingEngineService } from './desicion-making-engine.service';

const categories = {
  DEBT_TO_INCOME_RATIO_EXCEEDS: 'debt_to_income_ratio_exceeds',
  LOW_CREDIT_SCORE: 'low_credit_score',
  BANKRUPTCIES: 'bankruptcies',
  DELINQUENCIES: 'delinquencies',
  LOAN_TO_VALUE_RATIO_EXCEEDS: 'loan_to_value_ratio_exceeds',
  GOOD: 'good',
};

const reasonType = {
  APPROVED: 'Loan Approved',
  DENIED: 'Loan Denied',
};
const extractCategory = (type: string) => (reasons) => {
  const reason = _.chain(reasons)
    .find((r: { type: string }) => r.type === type)
    .value();

  return _.get(reason, 'params.category');
};

const extractApproveCategory = (reason: Event[]) =>
  extractCategory(reasonType.APPROVED)(reason);

const extractDeniedCategory = (reason: Event[]) =>
  extractCategory(reasonType.DENIED)(reason);

describe('DesicionMakingEngineService', () => {
  let service: DesicionMakingEngineService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DesicionMakingEngineService],
    }).compile();

    service = module.get<DesicionMakingEngineService>(
      DesicionMakingEngineService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('evaluate', () => {
    let successfulInput: EvaluateInputType;
    beforeEach(() => {
      successfulInput = {
        creditScore: 803,
        monthlyDebt: 1500.23,
        monthlyIncome: 2000.0,
        bankruptcies: 0,
        delinquencies: 0,
        itemValue: 5000.0,
        loanAmount: 3000.0,
        loanPaymentAmount: 42.5,
        apr: 0.02,
        termInMonths: 72,
        applicantId: '',
      };
    });
    it('should fail due to low credit score ', async () => {
      successfulInput.creditScore = 540;
      const outcome = await service.evaluate(successfulInput);
      expect(outcome.approved).toBe(false);
      expect(outcome.reason.length).toBe(1);

      const category = extractDeniedCategory(outcome.reason);

      expect(category).toBe(categories.LOW_CREDIT_SCORE);
    });
    it('should fail due to bankruptcies be more than one', async () => {
      successfulInput.bankruptcies = 1;

      const outcome = await service.evaluate(successfulInput);

      expect(outcome.approved).toBe(false);
      expect(outcome.reason.length).toBe(1);

      const category = extractDeniedCategory(outcome.reason);

      expect(category).toBe(categories.BANKRUPTCIES);
    });
    it('should fail due to delinquencies be more than one', async () => {
      successfulInput.delinquencies = 1;

      const outcome = await service.evaluate(successfulInput);

      expect(outcome.approved).toBe(false);
      expect(outcome.reason.length).toBe(1);

      const category = extractDeniedCategory(outcome.reason);

      expect(category).toBe(categories.DELINQUENCIES);
    });
    it('should fail due to Loan-to-value ratio exceeds 100%', async () => {
      successfulInput.loanAmount = 5000;
      successfulInput.itemValue = 3000;

      const outcome = await service.evaluate(successfulInput);

      expect(outcome.approved).toBe(false);
      expect(outcome.reason.length).toBe(1);

      const category = extractDeniedCategory(outcome.reason);

      expect(category).toBe(categories.LOAN_TO_VALUE_RATIO_EXCEEDS);
    });
    it('should success due to Loan-to-value ratio exceeds 100% (loanAmount and itemValue are the same)', async () => {
      successfulInput.loanAmount = 5000;
      successfulInput.itemValue = 5000;

      const outcome = await service.evaluate(successfulInput);

      expect(outcome.approved).toBe(true);
      expect(outcome.reason.length).toBe(1);

      const category = extractApproveCategory(outcome.reason);

      expect(category).toBe('good');
    });
    it('should fail due to Debt-to-income ratio exceeds 60%', async () => {
      successfulInput.monthlyIncome = 1000;
      successfulInput.monthlyDebt = 3000;

      const outcome = await service.evaluate(successfulInput);

      expect(outcome.approved).toBe(false);
      expect(outcome.reason.length).toBe(1);

      const category = extractDeniedCategory(outcome.reason);

      expect(category).toBe(categories.DEBT_TO_INCOME_RATIO_EXCEEDS);
    });
    it('should fail due to Debt-to-income ratio exceeds 60% (monthlyIncome and monthlyDebt are the same', async () => {
      successfulInput.loanPaymentAmount = 1000;
      successfulInput.monthlyDebt = 3000;
      successfulInput.monthlyIncome = 3000;

      const outcome = await service.evaluate(successfulInput);

      expect(outcome.approved).toBe(false);
      expect(outcome.reason.length).toBe(1);

      const category = extractDeniedCategory(outcome.reason);

      expect(category).toBe(categories.DEBT_TO_INCOME_RATIO_EXCEEDS);
    });
    it('should success, everything is good', async () => {
      const outcome = await service.evaluate(successfulInput);

      expect(outcome.approved).toBe(true);
      expect(outcome.reason.length).toBe(1);

      const category = extractApproveCategory(outcome.reason);
      expect(category).toBe(categories.GOOD);
    });
    it('should fail due to any rule been true ', async () => {
      successfulInput = {
        creditScore: 103,
        monthlyDebt: 12500.23,
        monthlyIncome: 2000.0,
        bankruptcies: 1,
        delinquencies: 1,
        itemValue: 54000.0,
        loanAmount: 33000.0,
        loanPaymentAmount: 499992.5,
        apr: 0.02,
        termInMonths: 72,
        applicantId: '',
      };
      const outcome = await service.evaluate(successfulInput);
      expect(outcome.approved).toBe(false);
      expect(outcome.reason.length).not.toBeLessThan(1);
    });
  });
});
