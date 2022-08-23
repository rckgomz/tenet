import { Controller, Get } from '@nestjs/common';
import { AcquisitionService } from './acquisition.service';

@Controller()
export class AcquisitionController {
  constructor(private readonly acquisitionService: AcquisitionService) {}

  @Get()
  getHello(): string {
    return this.acquisitionService.getHello();
  }
}
