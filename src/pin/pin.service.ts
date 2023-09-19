import {BadRequestException, HttpStatus, Injectable, NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Pin } from './pin.entity';
import { Repository } from 'typeorm';
import {I18nService} from 'nestjs-i18n';
import { ResponseInterface } from '../shared/types/response.interface';
import { EnumsResponse } from '../shared/types/enums';
import { DevicesEnum } from '../device/types/devices.enum';
import { ESP8266_DIGITAL_PINOUT } from './constants/pinout';
import { ELECTRICAL_CONTACT } from './constants/electrical-contact';
import { CreatePinDto } from './dtos/pin.dto';

@Injectable()
export class PinService {
  constructor(
    @InjectRepository(Pin) private repo: Repository<Pin>,
    private i18n: I18nService,
  ) {}

  async create(
    body: CreatePinDto,
  ): Promise<ResponseInterface<string>> {
    const pin = await this.repo.create({
      createdAt: new Date().toISOString(),
      electricalContact: body.electricalContact,
      pinNumber: body.pinNumber,
      device: body.device,
    });

    const { id } = await this.repo.save(pin);

    return {
      data: id,
      statusCode: HttpStatus.CREATED,
      message: ''
    }
  }

  async findOne(id: string): Promise<ResponseInterface<Pin>> {
    const pin = await this.repo.findOneBy({ id });

    if (!pin) {
      throw new NotFoundException(this.i18n.translate('pin.errors.not_found'));
    }

    return {
      message: '',
      statusCode: HttpStatus.OK,
      data: pin,
    }
  }

  getEnums(): ResponseInterface<EnumsResponse> {
    return {
      data: {
        electricalContact: ELECTRICAL_CONTACT.map((e) => ({
          ...e,
          text: this.i18n.translate(e.text),
        })),
      },
      message: '',
      statusCode: HttpStatus.OK,
    };
  }

  getDevicesPins(device: DevicesEnum): ResponseInterface<EnumsResponse> {
    let data: EnumsResponse;
    switch (device) {
      case DevicesEnum.ESP8266:
        data = { [DevicesEnum.ESP8266]: ESP8266_DIGITAL_PINOUT };
        break;
      default:
        throw new BadRequestException(
          this.i18n.translate('pin.errors.bad_device_type'),
        );
    }

    return {
      data,
      message: '',
      statusCode: HttpStatus.OK,
    };
  }
}
