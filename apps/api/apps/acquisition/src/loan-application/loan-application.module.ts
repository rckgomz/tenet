import { Module } from '@nestjs/common';
import { LoanApplicationService } from './loan-application.service';
import { LoanApplicationController } from './loan-application.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Applicant, LoanApplication, LoanOffer } from './entities';
import { ProductModule } from '../product';
import { PersonModule } from '../person';
import { DesicionMakingEngineService } from './desicion-making-engine.service';
import { CreditReportService } from './credit-report.service';

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
  ],
  exports: [
    LoanApplicationService,
    ProductModule,
    PersonModule,
    DesicionMakingEngineService,
    CreditReportService,
  ],
})
export class LoanApplicationModule {}
