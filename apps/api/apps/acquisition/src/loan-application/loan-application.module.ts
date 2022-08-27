import { Module } from '@nestjs/common';
import { LoanApplicationController } from './loan-application.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Applicant, LoanApplication, LoanOffer } from './entities';
import { ProductModule } from '../product';
import { PersonModule } from '../person';
import {
  LoanApplicationService,
  DesicionMakingEngineService,
  CreditReportService,
  LoanOfferService,
} from './services';

@Module({
  imports: [
    TypeOrmModule.forFeature([LoanApplication, LoanOffer, Applicant]),
    ProductModule,
    PersonModule,
  ],
  controllers: [LoanApplicationController],
  providers: [
    LoanApplicationService,
    DesicionMakingEngineService,
    CreditReportService,
    LoanOfferService,
  ],
  exports: [
    LoanApplicationService,
    ProductModule,
    PersonModule,
    DesicionMakingEngineService,
    CreditReportService,
    LoanOfferService,
  ],
})
export class LoanApplicationModule {}
