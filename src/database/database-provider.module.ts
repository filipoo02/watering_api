import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { User } from '../auth/users/user.entity';
import { Device } from '../device/device.entity';
import { Pin } from '../pin/pin.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    TypeOrmModule.forRootAsync({
      imports: undefined,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'sqlite',
          entities: [User, Device, Pin],
          synchronize: true,
          database: config.get<string>('DB_NAME'),
        };
      },
    }),
  ],
})
export class DatabaseProviderModule {}
