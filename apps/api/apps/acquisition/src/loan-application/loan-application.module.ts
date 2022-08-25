import { Module } from '@nestjs/common';
import { LoanApplicationService } from './loan-application.service';
import { LoanApplicationController } from './loan-application.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoanApplication, LoanOffer } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([LoanApplication, LoanOffer])],
  controllers: [LoanApplicationController],
  providers: [LoanApplicationService],
})
export class LoanApplicationModule {}
