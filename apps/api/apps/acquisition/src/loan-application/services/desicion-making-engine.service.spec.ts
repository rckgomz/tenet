import { Test, TestingModule } from '@nestjs/testing';
import { DesicionMakingEngineService } from './desicion-making-engine.service';

describe('DesicionMakingEngineService', () => {
  let service: DesicionMakingEngineService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DesicionMakingEngineService],
    }).compile();

    service = module.get<DesicionMakingEngineService>(
      DesicionMakingEngineService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
