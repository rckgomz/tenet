import { Injectable, Logger } from '@nestjs/common';
import { Engine } from 'json-rules-engine';
import { EvaluateInputType } from '../types/evaluate-input.type';

@Injectable()
export class DesicionMakingEngineService {
  private logger: Logger;
  constructor() {
    this.logger = new Logger(DesicionMakingEngineService.name);
  }

  /**
   * Evaluate the appliaction and procedure an approve or deny outcome
   * @param input {EvaluateInputType} payload used for the decision
   * @returns an outcome
   */
  async evaluate(input: EvaluateInputType) {
    const engine = new Engine();

    this.logger.log('adding rule to engine: Any bankruptcies reported');
    engine.addRule({
      name: 'Any bankruptcies reported',
      conditions: {
        all: [
          {
            fact: 'bankruptcies',
            operator: 'greaterThanInclusive',
            value: 1,
          },
        ],
      },
      event: {
        type: 'Loan Denied',
        params: {
          category: 'bankruptcies',
          message: 'Some bankruptcies has been reported',
        },
      },
    });
    this.logger.log(
      'adding rule to engine: More than one delinquency reported',
    );
    engine.addRule({
      name: 'More than one delinquency reported',
      conditions: {
        all: [
          {
            fact: 'delinquencies',
            operator: 'greaterThanInclusive',
            value: 1,
          },
        ],
      },
      event: {
        type: 'Loan Denied',
        params: {
          category: 'delinquencies',
          message: 'Some delinquencies has been reported',
        },
      },
    });
    this.logger.log('adding rule to engine: Credit Below');
    engine.addRule({
      name: 'Credit Below',
      conditions: {
        all: [
          {
            fact: 'creditScore',
            operator: 'lessThan',
            value: 660,
          },
        ],
      },
      event: {
        type: 'Loan Denied',
        params: {
          category: 'low_credit_score',
          message: 'Low credit score',
        },
      },
    });
    this.logger.log('adding rule to engine: Debt-to-income ratio exceeds');
    engine.addRule({
      name: 'Debt-to-income ratio exceeds',
      conditions: {
        all: [
          {
            fact: 'debt2incomeRatioExceeds',
            operator: 'greaterThan',
            value: 60,
          },
        ],
      },
      event: {
        type: 'Loan Denied',
        params: {
          category: 'debt_to_income_ratio_exceeds',
          message: 'Debt-to-income ratio exceeds 60%',
        },
      },
    });
    this.logger.log('adding rule to engine: Loan-to-value ratio exceeds');
    engine.addRule({
      name: 'Loan-to-value ratio exceeds',
      conditions: {
        all: [
          {
            fact: 'loan2valueRatioExceeds',
            operator: 'greaterThan',
            value: 0,
          },
        ],
      },
      event: {
        type: 'Loan Denied',
        params: {
          category: 'loan_to_value_ratio_exceeds',
          message: 'Loan-to-value ratio exceeds 100%',
        },
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    engine.addFact('input', (_params, _lmanac) => {
      return input;
    });

    engine.addFact('loan2valueRatioExceeds', (params, almanac) => {
      return almanac
        .factValue('input')
        .then((x: EvaluateInputType) => {
          return (
            ((+x.loanAmount.valueOf() - +x.itemValue.valueOf()) /
              +x.loanAmount.valueOf()) *
            100
          );
        })
        .catch(this.logger.log);
    });

    engine.addFact('debt2incomeRatioExceeds', (params, almanac) => {
      return almanac
        .factValue('input')
        .then((x: EvaluateInputType) => {
          if (x.monthlyDebt === x.monthlyIncome) {
            return 100;
          }
          const op =
            ((+x.loanPaymentAmount.valueOf() +
              +x.monthlyDebt.valueOf() -
              +x.monthlyIncome.valueOf()) /
              +x.monthlyIncome.valueOf()) *
            100;
          return op;
        })
        .catch(this.logger.log);
    });

    const outcome = await engine.run(input);

    const evaluationResult = {
      approved: !(outcome?.events?.length > 0),
      reason:
        outcome?.events?.length > 0
          ? outcome?.events
          : [
              {
                type: 'Loan Approved',
                params: { category: 'good', message: 'Congrats!!' },
              },
            ],
      rawOutcome: JSON.parse(JSON.stringify(outcome)),
    };

    return evaluationResult;
  }
}
