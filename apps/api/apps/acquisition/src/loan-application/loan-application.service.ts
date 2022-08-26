import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass, plainToClassFromExist } from 'class-transformer';
import { Repository } from 'typeorm';
import { PersonService } from '../person';
import { ProductService } from '../product';
import { CreditReportService } from './credit-report.service';
import { DesicionMakingEngineService } from './desicion-making-engine.service';
import { EvaluateInputType } from './evaluate-input.type';
import { CreateLoanApplicationDto } from './dto/create-loan-application.dto';
import { UpdateLoanApplicationDto } from './dto/update-loan-application.dto';
import {
  Applicant,
  LoanApplication,
  LoanApplicationStatusType,
} from './entities';

@Injectable()
export class LoanApplicationService {
  private logger: Logger;
  constructor(
    @InjectRepository(LoanApplication)
    private readonly repo: Repository<LoanApplication>,
    @InjectRepository(Applicant)
    private readonly applicantRepo: Repository<Applicant>,
    private readonly productSvc: ProductService,
    private readonly personSvc: PersonService,
    private readonly creditReportSvc: CreditReportService,
    private readonly desicionMakingengine: DesicionMakingEngineService,
  ) {
    this.logger = new Logger(LoanApplication.name);
  }

  async create(createLoanApplicationDto: CreateLoanApplicationDto) {
    const newApp = this.repo.create({});
    const product = await this.productSvc.findOne(
      createLoanApplicationDto.productId,
    );
    const applicants = createLoanApplicationDto.applicants.map(async (dto) => {
      const newApplicant = this.applicantRepo.create();
      const mergedApplicant = plainToClassFromExist(newApplicant, dto);

      const person = await this.personSvc.findOne(dto.personId);
      mergedApplicant.person = person;
      mergedApplicant.personSnapshot = <Record<string, unknown>>(
        JSON.parse(JSON.stringify(person))
      );

      return mergedApplicant;
    });

    newApp.product = product;
    newApp.applicants = await Promise.all(applicants);
    const mergedApp = plainToClassFromExist(newApp, createLoanApplicationDto);
    return this.repo.save(mergedApp);
  }

  findAll() {
    return this.repo.find({ relations: { loanOffer: true } });
  }

  findOne(id: string) {
    return this.repo.findOne({ where: { id }, relations: { loanOffer: true } });
  }

  update(id: string, updateLoanApplicationDto: UpdateLoanApplicationDto) {
    return this.repo.update(id, updateLoanApplicationDto);
  }

  remove(id: string) {
    return this.repo.delete(id);
  }

  updateStatus(id: string, status: LoanApplicationStatusType) {
    return this.repo.update(id, {
      status,
    });
  }

  getAPRBasedOnScore(score: number) {
    let apr = 0.1;
    // this can be extracted to a separete table or resource
    const scale = [
      { min: 780, max: 999, apr: 0.02 },
      { min: 720, max: 779, apr: 0.05 },
      { min: 660, max: 719, apr: 0.08 },
    ].sort((a, b) => b.min - a.min);

    for (let i = 0; i < scale.length; i++) {
      const element = scale[i];
      if (score >= element.min && score <= element.max) {
        apr = element.apr;
        break;
      }
    }

    return apr;
  }

  calculateLoanPaymentAmount(
    loanAmount: number,
    apr: number,
    termInMonths: number,
  ) {
    const interest = (loanAmount * apr) / termInMonths;
    const loanPaymentAmount = (loanAmount / termInMonths + interest).toFixed(2);
    return loanPaymentAmount;
  }

  async submitLoanApplication(id: string) {
    const application = await this.repo.findOne({
      where: { id },
      relations: { loanOffer: true, applicants: true },
    });
    await this.updateStatus(id, 'submitted');
    this.logger.log('application recevied, marking as submitted');

    await this.updateStatus(id, 'processing');
    this.logger.log('precessing appplication, gathering all info');
    const applicantsInfo = application.applicants.map((app) => ({
      ...app,
      creditReportInfo: this.creditReportSvc.getCreditInfo(app?.person?.ssn),
    }));
    this.logger.log('credit report gathered');

    this.logger.log('running engine awaiting for a desicion');
    const outcomes = applicantsInfo.map(async (a) => {
      const apr = this.getAPRBasedOnScore(a.creditReportInfo.creditScore);

      // const interest = (application.amount * apr) / 72;
      // const loanPaymentAmount = (application.amount / 72 + interest).toFixed(2);

      const input = plainToClass(EvaluateInputType, {
        creditScore: a.creditReportInfo.creditScore,
        monthlyDebt: a.monthlyDebt,
        monthlyIncome: a.monthlyIncome,
        bankruptcies: a.creditReportInfo.bankruptcies,
        delinquencies: a.creditReportInfo.delinquencies,
        itemValue: application.itemValue,
        loanAmount: application.amount,
        loanPaymentAmount: this.calculateLoanPaymentAmount(
          application.amount,
          apr,
          72,
        ),
        termsInMonths: 72,
        apr,
      });
      const outcome = await this.desicionMakingengine.evaluate(input);

      return outcome;
    });
    this.logger.log('application processed');

    return (await Promise.all(outcomes)).map((o) => ({
      approved: o.approved,
      reason: o.reason,
    }));
  }
}
