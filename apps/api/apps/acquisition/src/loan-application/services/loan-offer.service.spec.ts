import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { LoanOffer } from '../entities/loan-offer.entity';
import { LoanOfferService } from './loan-offer.service';

describe('ServicesSLoanOfferServiceervice', () => {
  type NewType = LoanOfferService;

  let service: NewType;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoanOfferService,
        {
          provide: getRepositoryToken(LoanOffer),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<LoanOfferService>(LoanOfferService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
