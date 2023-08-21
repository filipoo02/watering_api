import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AccessTokenGuard } from './guards/access-token.guard';
import { DeviceModule } from './device/device.module';
import { DatabaseProviderModule } from './database/database-provider.module';
import { TasksModule } from './tasks/tasks.module';
import { ScheduleModule } from '@nestjs/schedule';
import * as path from 'path';
import { AcceptLanguageResolver, I18nModule } from 'nestjs-i18n';

@Module({
  imports: [
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.join(__dirname, '/i18n/'),
        watch: true,
      },
      resolvers: [AcceptLanguageResolver],
    }),
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    DatabaseProviderModule,
    AuthModule,
    DeviceModule,
    TasksModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard,
    },
  ],
})
export class AppModule {}
