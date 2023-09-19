import { PinService } from './pin.service';
import {Body, Controller, Get, HttpCode, HttpStatus, Param, Post} from '@nestjs/common';
import { ResponseInterface } from '../shared/types/response.interface';
import { EnumsResponse } from '../shared/types/enums';
import {DevicesEnum} from "../device/types/devices.enum";
import {CreatePinDto} from "./dtos/pin.dto";

@Controller('pin')
export class PinController {
  constructor(
    private pinService: PinService,
  ) {}

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createPinDto: CreatePinDto): Promise<ResponseInterface<string>> {
    return this.pinService.create(createPinDto);
  }

  @Get('enums')
  getEnums(): ResponseInterface<EnumsResponse> {
    return this.pinService.getEnums();
  }

  @Get('enums/device/:type')
  getDevicesPins(@Param('type') type: DevicesEnum): ResponseInterface<EnumsResponse> {
    return this.pinService.getDevicesPins(type);
  }
}
