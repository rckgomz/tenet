import { HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { Email } from '../../person/entities/email.entity';
import { Person } from '../../person/entities/person.entity';
import { PhoneNumber } from '../../person/entities/phone.entity';
import { PersonService } from '../../person/person.service';
import { Product } from '../../product/entities/product.entity';
import { ProductService } from '../../product/product.service';
import { Applicant } from '../entities/applicant.entity';
import { LoanApplicationStatusType } from '../entities/loan-application-status.type';
import { LoanApplication } from '../entities/loan-application.entity';
import { LoanOffer } from '../entities/loan-offer.entity';
import { CreditReportService } from './credit-report.service';
import { DesicionMakingEngineService } from './desicion-making-engine.service';
import { LoanApplicationService } from './loan-application.service';
import { LoanOfferService } from './loan-offer.service';

describe('LoanApplicationService', () => {
  const LOAN_APPLICATION_REPOSITORY_TOKEN = getRepositoryToken(LoanApplication);
  const LOAN_OFFER_REPOSITORY_TOKEN = getRepositoryToken(LoanOffer);

  let service: LoanApplicationService;
  let creditReportSvc: CreditReportService;
  let desicionMakingengine: DesicionMakingEngineService;
  let applicationRepo: Repository<LoanApplication>;
  let loanOfferRepo: Repository<LoanOffer>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoanApplicationService,
        {
          provide: LOAN_APPLICATION_REPOSITORY_TOKEN,
          useValue: {
            findOne: jest.fn(),
            update: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Applicant),
          useValue: {},
        },
        {
          provide: LOAN_OFFER_REPOSITORY_TOKEN,
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
          },
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
    creditReportSvc = module.get<CreditReportService>(CreditReportService);
    desicionMakingengine = module.get<DesicionMakingEngineService>(
      DesicionMakingEngineService,
    );
    applicationRepo = module.get<Repository<LoanApplication>>(
      LOAN_APPLICATION_REPOSITORY_TOKEN,
    );
    loanOfferRepo = module.get<Repository<LoanOffer>>(
      LOAN_OFFER_REPOSITORY_TOKEN,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(applicationRepo).toBeDefined();
    expect(loanOfferRepo).toBeDefined();
    expect(creditReportSvc).toBeDefined();
    expect(desicionMakingengine).toBeDefined();
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
    it('should return an error if application is closed or approved or rejected', async () => {
      jest.spyOn(applicationRepo, 'findOne').mockResolvedValue({
        amount: 1,
        applicants: [],
        product: null,
        termInMonths: 72,
        itemValue: 100,
        loanOffer: null,
        status: 'closed',
        id: '1234',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: new Date(),
        version: 1,
      });

      const submition = await service.submitLoanApplication('1234');

      expect(applicationRepo.findOne).toHaveBeenCalledWith({
        relations: { applicants: true, loanOffer: true },
        where: { id: '1234' },
      });

      expect(submition).toBeInstanceOf(HttpException);
    });

    it('it should change status to submitted if is not closed, approved or rejected', async () => {
      const appId = '1234';
      jest.spyOn(applicationRepo, 'findOne').mockResolvedValue({
        amount: 2,
        applicants: [],
        product: null,
        termInMonths: 72,
        itemValue: 100,
        loanOffer: null,
        status: 'openned',
        id: appId,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: new Date(),
        version: 1,
      });

      jest.spyOn(service, 'updateStatus').mockImplementation(
        (
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          id: string,
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          status: LoanApplicationStatusType,
        ): Promise<UpdateResult> => {
          return Promise.resolve(null);
        },
      );

      await service.submitLoanApplication(appId);

      expect(applicationRepo.findOne).toHaveBeenCalledWith({
        relations: { applicants: true, loanOffer: true },
        where: { id: appId },
      });

      expect(service.updateStatus).toHaveBeenCalledWith(appId, 'submitted');
      expect(service.updateStatus).toHaveBeenCalledWith(appId, 'processing');
    });

    it('should get a credit report for an applicant inside the application', async () => {
      const appId = '1234';
      jest.spyOn(applicationRepo, 'findOne').mockResolvedValue({
        amount: 990,
        applicants: [
          {
            createdAt: new Date(),
            deletedAt: new Date(),
            id: '',
            loanApplication: null,
            monthlyDebt: 0,
            monthlyIncome: 0,
            person: {
              address: [],
              applicants: [],
              createdAt: new Date(),
              dateOfBirth: new Date(),
              deletedAt: new Date(),
              emails: [],
              firstName: '',
              id: '',
              lastName: '',
              mailingAddress: null,
              phoneNumbers: null,
              primaryAddress: null,
              primaryEmail: null,
              primaryPhoneNumber: '',
              ssn: '123456789',
              updatedAt: new Date(),
              version: 1,
            },
            personSnapshot: {},
            updatedAt: new Date(),
            version: 1,
          },
        ],
        product: null,
        termInMonths: 72,
        itemValue: 100,
        loanOffer: null,
        status: 'submitted',
        id: appId,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: new Date(),
        version: 1,
      });

      jest.spyOn(creditReportSvc, 'getCreditInfo').mockReturnValueOnce({
        ssn: '123456789',
        creditScore: 740,
        bankruptcies: 0,
        delinquencies: 0,
      });

      await service.submitLoanApplication(appId);

      expect(creditReportSvc.getCreditInfo).toHaveBeenCalledTimes(1);
    });

    it('should get a APR based on score for an applicant inside the application', async () => {
      const appId = '1234';
      jest.spyOn(applicationRepo, 'findOne').mockResolvedValue({
        amount: 990,
        applicants: [
          {
            createdAt: new Date(),
            deletedAt: new Date(),
            id: '',
            loanApplication: null,
            monthlyDebt: 0,
            monthlyIncome: 0,
            person: {
              address: [],
              applicants: [],
              createdAt: new Date(),
              dateOfBirth: new Date(),
              deletedAt: new Date(),
              emails: [],
              firstName: '',
              id: '',
              lastName: '',
              mailingAddress: null,
              phoneNumbers: null,
              primaryAddress: null,
              primaryEmail: null,
              primaryPhoneNumber: '',
              ssn: '123456789',
              updatedAt: new Date(),
              version: 1,
            },
            personSnapshot: {},
            updatedAt: new Date(),
            version: 1,
          },
        ],
        product: null,
        termInMonths: 72,
        itemValue: 100,
        loanOffer: null,
        status: 'submitted',
        id: appId,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: new Date(),
        version: 1,
      });

      jest.spyOn(service, 'getAPRBasedOnScore').mockReturnValueOnce(0.05);

      await service.submitLoanApplication(appId);

      expect(service.getAPRBasedOnScore).toHaveBeenCalledTimes(1);
    });

    it('should call the evaluate method for an applicant inside the application', async () => {
      const appId = '1234';
      jest.spyOn(applicationRepo, 'findOne').mockResolvedValue({
        amount: 990,
        applicants: [
          {
            createdAt: new Date(),
            deletedAt: new Date(),
            id: '',
            loanApplication: null,
            monthlyDebt: 0,
            monthlyIncome: 0,
            person: {
              address: [],
              applicants: [],
              createdAt: new Date(),
              dateOfBirth: new Date(),
              deletedAt: new Date(),
              emails: [],
              firstName: '',
              id: '',
              lastName: '',
              mailingAddress: null,
              phoneNumbers: null,
              primaryAddress: null,
              primaryEmail: null,
              primaryPhoneNumber: '',
              ssn: '123456789',
              updatedAt: new Date(),
              version: 1,
            },
            personSnapshot: {},
            updatedAt: new Date(),
            version: 1,
          },
        ],
        product: null,
        termInMonths: 72,
        itemValue: 100,
        loanOffer: null,
        status: 'submitted',
        id: appId,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: new Date(),
        version: 1,
      });

      jest.spyOn(desicionMakingengine, 'evaluate').mockResolvedValue({
        approved: true,
        reason: [],
        rawOutcome: [],
      });

      await service.submitLoanApplication(appId);

      expect(desicionMakingengine.evaluate).toHaveBeenCalledTimes(1);
    });

    it('should call update status on the last step of the submition', async () => {
      const appId = '1234';
      jest.spyOn(applicationRepo, 'findOne').mockResolvedValue({
        amount: 990,
        applicants: [
          {
            createdAt: new Date(),
            deletedAt: new Date(),
            id: '',
            loanApplication: null,
            monthlyDebt: 0,
            monthlyIncome: 0,
            person: {
              address: [],
              applicants: [],
              createdAt: new Date(),
              dateOfBirth: new Date(),
              deletedAt: new Date(),
              emails: [],
              firstName: '',
              id: '',
              lastName: '',
              mailingAddress: null,
              phoneNumbers: null,
              primaryAddress: null,
              primaryEmail: null,
              primaryPhoneNumber: '',
              ssn: '123456789',
              updatedAt: new Date(),
              version: 1,
            },
            personSnapshot: {},
            updatedAt: new Date(),
            version: 1,
          },
        ],
        product: null,
        termInMonths: 72,
        itemValue: 100,
        loanOffer: null,
        status: 'submitted',
        id: appId,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: new Date(),
        version: 1,
      });

      jest.spyOn(service, 'updateStatus').mockImplementation(
        (
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          id: string,
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          status: LoanApplicationStatusType,
        ): Promise<UpdateResult> => {
          return Promise.resolve(null);
        },
      );

      await service.submitLoanApplication(appId);

      expect(service.updateStatus).toHaveBeenCalledTimes(3);
      expect(service.updateStatus).toHaveBeenCalledWith(appId, 'rejected');
    });
  });
});
