import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClassFromExist } from 'class-transformer';
import { Repository } from 'typeorm';
import { CreateLoanApplicationDto } from './dto/create-loan-application.dto';
import { UpdateLoanApplicationDto } from './dto/update-loan-application.dto';
import { LoanApplication } from './entities';

@Injectable()
export class LoanApplicationService {
  constructor(
    @InjectRepository(LoanApplication)
    private readonly repo: Repository<LoanApplication>,
  ) {}

  create(createLoanApplicationDto: CreateLoanApplicationDto) {
    const newApp = this.repo.create({});

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