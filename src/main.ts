import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';
import {I18nValidationPipe} from "nestjs-i18n";
import {I18nFilter} from './filters/i18n.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useGlobalPipes(new I18nValidationPipe());
  app.useGlobalFilters(new I18nFilter());
  app.setGlobalPrefix('api/v1');

  await app.listen(3000);
}
bootstrap();
