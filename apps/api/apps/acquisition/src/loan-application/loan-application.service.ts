import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClassFromExist } from 'class-transformer';
import { Repository } from 'typeorm';
import { PersonService } from '../person';
import { ProductService } from '../product';
import { CreateLoanApplicationDto } from './dto/create-loan-application.dto';
import { UpdateLoanApplicationDto } from './dto/update-loan-application.dto';
import { Applicant, LoanApplication } from './entities';

@Injectable()
export class LoanApplicationService {
  constructor(
    @InjectRepository(LoanApplication)
    private readonly repo: Repository<LoanApplication>,
    @InjectRepository(Applicant)
    private readonly applicantRepo: Repository<Applicant>,
    private readonly productSvc: ProductService,
    private readonly personSvc: PersonService,
  ) {}

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
}
