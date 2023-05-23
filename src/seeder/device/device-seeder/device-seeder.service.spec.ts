import { Test, TestingModule } from '@nestjs/testing';
import { DeviceSeederService } from './device-seeder.service';

describe('DeviceSeederService', () => {
  let service: DeviceSeederService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DeviceSeederService],
    }).compile();

    service = module.get<DeviceSeederService>(DeviceSeederService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
