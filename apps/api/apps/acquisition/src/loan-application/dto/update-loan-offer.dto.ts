import { PartialType } from '@nestjs/mapped-types';
import { CreateLoanOfferDto } from './create-loan-offer.dto';

export class UpdateLoanOfferDto extends PartialType(CreateLoanOfferDto) {}
