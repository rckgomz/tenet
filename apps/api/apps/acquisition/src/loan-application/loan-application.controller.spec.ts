import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PersonService } from '../person/person.service';
import { Applicant } from './entities/applicant.entity';
import { LoanApplication } from './entities/loan-application.entity';
import { LoanApplicationController } from './loan-application.controller';
import { LoanApplicationService } from './services/loan-application.service';

describe('LoanApplicationController', () => {
  let controller: LoanApplicationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LoanApplicationController],
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
        PersonService,
      ],
    }).compile();

    controller = module.get<LoanApplicationController>(
      LoanApplicationController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
