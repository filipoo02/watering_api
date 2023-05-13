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

@Controller('device')
export class DeviceController {
  constructor(private deviceService: DeviceService) {}

  @Get(':id')
  findDevice(@Param('id') id: string): Promise<Device> {
    return this.deviceService.findOne(id);
  }

  @Get()
  getDevice(@CurrentUser() user: User): Promise<Device> {
    return this.deviceService.getUserDevice(user);
  }

  @Patch('update')
  @HttpCode(HttpStatus.OK)
  update(@Param('id') id: string, body: Partial<Device>): Promise<Device> {
    return this.deviceService.update(id, body);
  }

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  createDevice(@CurrentUser() user: User): Promise<DeviceCredentialsInterface> {
    return this.deviceService.create(user);
  }

  @Post('register')
  @HttpCode(HttpStatus.OK)
  registerDeivce(
    @Body() { id }: DeviceCredentialsInterface,
    @Req() request: Request,
  ) {
    const address = `${request.ip}:${request.socket.remotePort}`;
    return this.deviceService.registerDevice({ id, address });
  }
}
