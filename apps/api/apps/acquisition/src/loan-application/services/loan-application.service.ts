import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass, plainToClassFromExist } from 'class-transformer';
import * as _ from 'lodash';
import { Repository } from 'typeorm';

import { PersonService } from '../../person/person.service';
import { ProductService } from '../../product/product.service';
import { CreateLoanApplicationDto } from '../dto/create-loan-application.dto';
import { CreateLoanOfferDto } from '../dto/create-loan-offer.dto';
import { UpdateLoanApplicationDto } from '../dto/update-loan-application.dto';
import { Applicant } from '../entities/applicant.entity';
import { LoanApplicationStatusType } from '../entities/loan-application-status.type';
import { LoanApplication } from '../entities/loan-application.entity';
import { EvaluateInputType } from '../types/evaluate-input.type';
import { CreditReportService } from './credit-report.service';
import { DesicionMakingEngineService } from './desicion-making-engine.service';
import { LoanOfferService } from './loan-offer.service';

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
    private readonly loanOfferSvc: LoanOfferService,
  ) {
    this.logger = new Logger(LoanApplication.name);
  }

  async create(createLoanApplicationDto: CreateLoanApplicationDto) {
    const newApp = this.repo.create({});
    const product = await this.productSvc.findOne(
      createLoanApplicationDto.productId,
    );

    if (_.isNull(product) || _.isUndefined(product)) {
      return new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error:
            'product was not found, you cannot create an application without a product',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const applicants = createLoanApplicationDto.applicants?.map(async (dto) => {
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
    newApp.termInMonths = product?.termInMonths;
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

  /**
   * Given a score return an APR base on an scale
   * @param score {number} score to be evaluated
   * @returns {number} an APR
   */
  getAPRBasedOnScore(score: number) {
    let apr = 0;
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

  /**
   * Calculate the loan payment based on terms in months
   * @param loanAmount {number} amount of the loan
   * @param apr {number} the APR used
   * @param termInMonths {number} the loan terms in months
   * @returns {number} montntly payment (loan amount / termsInMonths + interest)
   */
  calculateLoanPaymentAmount(
    loanAmount: number,
    apr: number,
    termInMonths: number,
  ) {
    if (termInMonths <= 0) {
      throw new Error('termInMonths needs to be greather than zero');
    }

    if (loanAmount <= 0) {
      throw new Error('loan amount needs to be greather than zero');
    }
    const interest = (loanAmount * apr) / termInMonths;
    const loanPaymentAmount = (loanAmount / termInMonths + interest).toFixed(2);
    return loanPaymentAmount;
  }

  /**
   * Submit the application to process an outcome
   * @param id {string} loan application id
   * @returns return an outcome (approve/denied)
   */
  async submitLoanApplication(id: string) {
    const application = await this.repo.findOne({
      where: { id },
      relations: { loanOffer: true, applicants: true },
    });

    if (['closed', 'approved', 'rejected'].includes(application?.status)) {
      return new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error:
            'This application is in one of the following status: closed, approved, rejected',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.updateStatus(id, 'submitted');
    this.logger.log('application recevied, marking as submitted');

    await this.updateStatus(id, 'processing');
    this.logger.log('precessing appplication, gathering all info');
    const applicantsInfo = application?.applicants?.map((app) => ({
      ...app,
      creditReportInfo: this.creditReportSvc.getCreditInfo(app?.person?.ssn),
    }));
    this.logger.log('credit report gathered');

    this.logger.log('running engine awaiting for a desicion');

    const offerDataSeed = [];

    const outcomes =
      applicantsInfo?.map(async (a) => {
        const apr = this.getAPRBasedOnScore(a?.creditReportInfo?.creditScore);

        const input = plainToClass(EvaluateInputType, {
          creditScore: a.creditReportInfo?.creditScore,
          monthlyDebt: a.monthlyDebt,
          monthlyIncome: a.monthlyIncome,
          bankruptcies: a.creditReportInfo.bankruptcies,
          delinquencies: a.creditReportInfo.delinquencies,
          itemValue: application.itemValue,
          loanAmount: application.amount,
          loanPaymentAmount: this.calculateLoanPaymentAmount(
            application.amount,
            apr,
            application.termInMonths,
          ),
          termsInMonths: application.termInMonths,
          apr,
          appliantId: a.id,
        });

        offerDataSeed.push(input);

        const outcome = await this.desicionMakingengine.evaluate(input);

        return outcome;
      }) || [];
    this.logger.log('application processed');

    const _outcomes = (await Promise.all(outcomes)).map((o) => ({
      approved: o.approved,
      reason: o.reason,
    }));

    const offerData: CreateLoanOfferDto = {
      accepted: <boolean>(_.meanBy(_outcomes, 'approved') >= 1),
      apr: _.meanBy<number>(offerDataSeed, 'apr'),
      monthlyPayment: _.meanBy(offerDataSeed, 'loanPaymentAmount'),
      reason: _outcomes?.map((o) => o.reason),
      applicantFacts: offerDataSeed,
    };

    const loanOffer = await this.loanOfferSvc.create(offerData);
    await this.repo.update(id, { loanOffer: { id: loanOffer?.id } });

    if (loanOffer?.accepted) {
      this.updateStatus(id, 'approved');
    } else {
      this.updateStatus(id, 'rejected');
    }

    return offerData;
  }
}
