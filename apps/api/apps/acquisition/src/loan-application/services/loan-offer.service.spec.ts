import { Test, TestingModule } from '@nestjs/testing';
import { LoanOfferService } from './loan-offer.service';

describe('ServicesSLoanOfferServiceervice', () => {
  let service: LoanOfferService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LoanOfferService],
    }).compile();

    service = module.get<LoanOfferService>(LoanOfferService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
