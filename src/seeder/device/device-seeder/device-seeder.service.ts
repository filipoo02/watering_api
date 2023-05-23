import { Injectable } from '@nestjs/common';
import { SeederAbstractService } from '../../seeder-abstract.service';

@Injectable()
export class DeviceSeederService extends SeederAbstractService {
  async seed(): Promise<void> {
    // TODO
    return new Promise((resolve) => resolve);
  }
}
