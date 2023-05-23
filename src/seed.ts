import { NestFactory } from '@nestjs/core';
import { SeederModule } from './seeder/seeder.module';
import { UserSeederService } from './seeder/user/user-seeder/user-seeder.service';
import { DeviceSeederService } from './seeder/device/device-seeder/device-seeder.service';
import { SeederAbstractService } from './seeder/seeder-abstract.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(SeederModule);
  const seeders: SeederAbstractService[] = [];

  seeders.push(app.get(UserSeederService));
  seeders.forEach((seeder, i, arr) => {
    const lastOne = i === arr.length - 1;
    seeder.seed().then(() => {
      if (lastOne) {
        app.close().then(() => console.log('[SEEDER] Finished.'));
      }
    });
  });
}

bootstrap();
