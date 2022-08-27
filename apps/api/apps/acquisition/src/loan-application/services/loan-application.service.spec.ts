import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Email } from '../../person/entities/email.entity';
import { Person } from '../../person/entities/person.entity';
import { PhoneNumber } from '../../person/entities/phone.entity';
import { PersonService } from '../../person/person.service';
import { Product } from '../../product/entities/product.entity';
import { ProductService } from '../../product/product.service';
import { Applicant } from '../entities/applicant.entity';
import { LoanApplication } from '../entities/loan-application.entity';
import { LoanOffer } from '../entities/loan-offer.entity';
import { CreditReportService } from './credit-report.service';
import { DesicionMakingEngineService } from './desicion-making-engine.service';
import { LoanApplicationService } from './loan-application.service';
import { LoanOfferService } from './loan-offer.service';

describe('LoanApplicationService', () => {
  let service: LoanApplicationService;
  let applicationRepo: Repository<LoanApplication>;
  const LOAN_APPLICATION_REPOSITORY_TOKEN = getRepositoryToken(LoanApplication);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoanApplicationService,
        {
          provide: LOAN_APPLICATION_REPOSITORY_TOKEN,
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Applicant),
          useValue: {},
        },
        {
          provide: getRepositoryToken(LoanOffer),
          useValue: {},
        },
        {
          provide: getRepositoryToken(Product),
          useValue: {},
        },
        {
          provide: getRepositoryToken(Person),
          useValue: {},
        },
        {
          provide: getRepositoryToken(Email),
          useValue: {},
        },
        {
          provide: getRepositoryToken(PhoneNumber),
          useValue: {},
        },
        PersonService,
        ProductService,
        CreditReportService,
        DesicionMakingEngineService,
        LoanOfferService,
      ],
    }).compile();

    service = module.get<LoanApplicationService>(LoanApplicationService);
    applicationRepo = module.get<Repository<LoanApplication>>(
      LOAN_APPLICATION_REPOSITORY_TOKEN,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(applicationRepo).toBeDefined();
  });

  describe('getARPBasedOnScore', () => {
    it('should reutrn an 0.02 as APR if score is 780 and 999', () => {
      const apr = service.getAPRBasedOnScore(781);
      expect(apr).toBe(0.02);
    });
    it('should reutrn an 0.05 as APR if score is between 720 and 779', () => {
      const apr = service.getAPRBasedOnScore(722);
      expect(apr).toBe(0.05);
    });
    it('should reutrn an 0.08 as APR if score is between 660 and 719', () => {
      const apr = service.getAPRBasedOnScore(670);
      expect(apr).toBe(0.08);
    });
    it('should reutrn an 0 as APR if score is below 660', () => {
      const apr = service.getAPRBasedOnScore(640);
      expect(apr).toBe(0);
    });
  });

  describe('calculateLoanPaymentAmount', () => {
    it('it should work', () => {
      const loanPaymentAmount = service.calculateLoanPaymentAmount(
        1000,
        0.02,
        72,
      );
      expect(loanPaymentAmount).toBe('14.17');
    });
    it('it throw an error if term in months is equal to zero', () => {
      const t = () => service.calculateLoanPaymentAmount(1000, 0.02, 0);
      expect(t).toThrow(Error);
    });
    it('it throw an error if term in months is less to zero', () => {
      const t = () => service.calculateLoanPaymentAmount(1000, 0.02, -1);
      expect(t).toThrow(Error);
    });
    it('should success if APR is zero since that will make interest zero', () => {
      const loanPaymentAmount = service.calculateLoanPaymentAmount(1000, 0, 11);
      expect(loanPaymentAmount).toBe('90.91');
    });
    it('it throw an error if loan amount is less to zero', () => {
      const t = () => service.calculateLoanPaymentAmount(-1, 0.02, -1);
      expect(t).toThrow(Error);
    });
    it('it throw an error if loan amount is equals to zero', () => {
      const t = () => service.calculateLoanPaymentAmount(0, 0.02, -1);
      expect(t).toThrow(Error);
    });
  });

  describe('submitLoanApplication', () => {
    it('should return an error if application is closed or approved or rejected', () => {});
  });
});
