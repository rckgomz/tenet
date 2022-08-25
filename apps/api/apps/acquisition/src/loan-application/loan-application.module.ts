import { Module } from '@nestjs/common';
import { LoanApplicationService } from './loan-application.service';
import { LoanApplicationController } from './loan-application.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Applicant, LoanApplication, LoanOffer } from './entities';
import { ProductModule } from '../product';
import { PersonModule } from '../person';

@Module({
  imports: [
    TypeOrmModule.forFeature([LoanApplication, LoanOffer, Applicant]),
    ProductModule,
    PersonModule,
  ],
  controllers: [LoanApplicationController],
  providers: [LoanApplicationService],
  exports: [LoanApplicationService, ProductModule, PersonModule],
})
export class LoanApplicationModule {}
