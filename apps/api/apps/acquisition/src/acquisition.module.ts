import { Module } from '@nestjs/common';
import { ConfigModule } from '@tenet/config';
import { AcquisitionController } from './acquisition.controller';
import { AcquisitionService } from './acquisition.service';

@Module({
  imports: [ConfigModule],
  controllers: [AcquisitionController],
  providers: [AcquisitionService],
})
export class AcquisitionModule {}
