import { Module } from '@nestjs/common';
import { LoanApplicationController } from './loan-application.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PersonModule } from '../person/person.module';
import { ProductModule } from '../product/product.module';
import { Applicant } from './entities/applicant.entity';
import { LoanApplication } from './entities/loan-application.entity';
import { LoanOffer } from './entities/loan-offer.entity';
import { CreditReportService } from './services/credit-report.service';
import { DesicionMakingEngineService } from './services/desicion-making-engine.service';
import { LoanApplicationService } from './services/loan-application.service';
import { LoanOfferService } from './services/loan-offer.service';

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
