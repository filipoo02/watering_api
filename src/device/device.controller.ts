import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
  Patch,
} from '@nestjs/common';
import { DeviceService } from './device.service';
import { Device } from './device.entity';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { User } from 'src/auth/users/user.entity';
import { DeviceCredentialsInterface } from './types/device-credentials.interface';
import { Request } from 'express';
import { CreateDeviceDto } from './dtos/create-device.dto';
import { I18n, I18nContext, I18nService } from 'nestjs-i18n';
import { ResponseInterface } from '../shared/types/response.interface';

@Controller('device')
export class DeviceController {
  constructor(
    private deviceService: DeviceService,
    private i18nService: I18nService,
  ) {}

  @Get(':id')
  findDevice(
    @Param('id') id: string,
    @I18n() i18n: I18nContext,
  ): Promise<Device> {
    return this.deviceService.findOne(id, i18n.lang);
  }

  @Get()
  getDevices(@CurrentUser() user: User): Promise<Device[]> {
    return this.deviceService.getUserDevices(user);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() body: { device: Partial<Device> },
    @I18n() i18n: I18nContext,
  ): Promise<ResponseInterface> {
    await this.deviceService.update(id, body.device, i18n.lang);

    return {
      message: this.i18nService.translate('response-msg.success.update', {
        lang: i18n.lang,
      }),
      statusCode: HttpStatus.OK,
      data: null,
    };
  }

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  createDevice(
    @CurrentUser() user: User,
    @Body() body: CreateDeviceDto,
  ): Promise<DeviceCredentialsInterface> {
    return this.deviceService.create(user, body);
  }

  @Post('register')
  @HttpCode(HttpStatus.OK)
  registerDevice(
    @Body() { id }: DeviceCredentialsInterface,
    @Req() request: Request,
    @I18n() i18n: I18nContext,
  ) {
    const address = `${request.ip}:${request.socket.remotePort}`;
    return this.deviceService.registerDevice({ id, address, lang: i18n.lang });
  }
}
