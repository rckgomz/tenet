import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClassFromExist } from 'class-transformer';
import { Repository } from 'typeorm';
import { CreateLoanOfferDto } from '../dto/create-loan-offer.dto';
import { UpdateLoanOfferDto } from '../dto/update-loan-offer.dto';
import { LoanOffer } from '../entities/loan-offer.entity';

@Injectable()
export class LoanOfferService {
  constructor(
    @InjectRepository(LoanOffer)
    private readonly repo: Repository<LoanOffer>,
  ) {}

  create(createLoanOffer: CreateLoanOfferDto) {
    const newOffer = this.repo.create();
    const mergedOffer = plainToClassFromExist(newOffer, createLoanOffer);

    return this.repo.save(mergedOffer);
  }

  findAll() {
    return this.repo.find();
  }

  findOne(id: string) {
    return this.repo.findOneBy({ id });
  }

  update(id: string, updateLoanOffer: UpdateLoanOfferDto) {
    return this.repo.update(id, updateLoanOffer);
  }

  remove(id: string) {
    return this.repo.delete(id);
  }
}
