import { HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Email } from '../person/entities/email.entity';
import { Person } from '../person/entities/person.entity';
import { PhoneNumber } from '../person/entities/phone.entity';
import { PersonService } from '../person/person.service';
import { Product } from '../product/entities/product.entity';
import { ProductService } from '../product/product.service';
import { Applicant } from './entities/applicant.entity';
import { LoanApplication } from './entities/loan-application.entity';
import { LoanOffer } from './entities/loan-offer.entity';
import { LoanApplicationController } from './loan-application.controller';
import { CreditReportService } from './services/credit-report.service';
import { DesicionMakingEngineService } from './services/desicion-making-engine.service';
import { LoanApplicationService } from './services/loan-application.service';
import { LoanOfferService } from './services/loan-offer.service';

describe('LoanApplicationController', () => {
  let controller: LoanApplicationController;

  const LOAN_APPLICATION_REPOSITORY_TOKEN = getRepositoryToken(LoanApplication);
  let applicationRepo: Repository<LoanApplication>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LoanApplicationController],
      providers: [
        LoanApplicationService,
        {
          provide: LOAN_APPLICATION_REPOSITORY_TOKEN,
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
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
          useValue: {
            findOneBy: jest.fn(),
          },
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

    controller = module.get<LoanApplicationController>(
      LoanApplicationController,
    );
    applicationRepo = module.get<Repository<LoanApplication>>(
      LOAN_APPLICATION_REPOSITORY_TOKEN,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(applicationRepo).toBeDefined();
  });

  describe('create a loan application', () => {
    it('should fail if product is not present', async () => {
      const appId = '1234';
      jest.spyOn(applicationRepo, 'create').mockReturnValue({
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

      const app = await controller.create({
        productId: null,
        applicants: [],
        amount: 100,
        itemValue: 122,
      });

      expect(app).toBeInstanceOf(HttpException);
    });
  });
});
