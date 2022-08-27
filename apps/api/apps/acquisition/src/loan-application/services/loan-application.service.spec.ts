import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoanApplicationService,
        {
          provide: getRepositoryToken(LoanApplication),
          useValue: {},
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
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
