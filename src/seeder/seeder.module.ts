import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { DeviceModule } from '../device/device.module';
import { UserSeederService } from './user/user-seeder/user-seeder.service';
import { DeviceSeederService } from './device/device-seeder/device-seeder.service';
import { DatabaseProviderModule } from '../database/database-provider.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    DatabaseProviderModule,
    AuthModule,
    DeviceModule,
  ],
  providers: [UserSeederService, DeviceSeederService],
})
export class SeederModule {}
