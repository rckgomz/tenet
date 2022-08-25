import { Test, TestingModule } from '@nestjs/testing';
import { AcquisitionController } from './acquisition.controller';
import { AcquisitionService } from './acquisition.service';

describe('AcquisitionController', () => {
  let acquisitionController: AcquisitionController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AcquisitionController],
      providers: [AcquisitionService],
    }).compile();

    acquisitionController = app.get<AcquisitionController>(
      AcquisitionController,
    );
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(acquisitionController.getHello()).toBe('Hello World!');
    });
  });
});
