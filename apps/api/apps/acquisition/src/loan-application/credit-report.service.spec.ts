import { Test, TestingModule } from '@nestjs/testing';
import { CreditReportService } from './credit-report.service';

describe('CreditReportService', () => {
  let service: CreditReportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CreditReportService],
    }).compile();

    service = module.get<CreditReportService>(CreditReportService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
