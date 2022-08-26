import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CreateLoanApplicationDto, UpdateLoanApplicationDto } from './dto';
import { LoanApplicationService } from './services';

@Controller('loan-applications')
export class LoanApplicationController {
  constructor(
    private readonly loanApplicationService: LoanApplicationService,
  ) {}

  @Post()
  create(@Body() createLoanApplicationDto: CreateLoanApplicationDto) {
    return this.loanApplicationService.create(createLoanApplicationDto);
  }

  @Get()
  findAll() {
    return this.loanApplicationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.loanApplicationService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateLoanApplicationDto: UpdateLoanApplicationDto,
  ) {
    return this.loanApplicationService.update(id, updateLoanApplicationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.loanApplicationService.remove(id);
  }

  @Patch(':id/submit')
  submitLoanApplication(@Param('id') id: string) {
    return this.loanApplicationService.submitLoanApplication(id);
  }
}
