import { Injectable } from '@nestjs/common';

@Injectable()
export class AcquisitionService {
  getHello(): string {
    return 'Hello World!';
  }
}
