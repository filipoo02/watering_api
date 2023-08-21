import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Device } from './device.entity';
import { User } from 'src/auth/users/user.entity';
import { CreateDeviceDto } from './dtos/create-device.dto';

import { I18nService } from 'nestjs-i18n';

@Injectable()
export class DeviceService {
  constructor(
    @InjectRepository(Device) private repo: Repository<Device>,
    private i18n: I18nService,
  ) {}

  async update(
    id: string,
    device: Partial<Device>,
    lang: string,
  ): Promise<Device> {
    const storedDevice = await this.findOne(id, lang);

    if (device.users?.length) {
      device.users.forEach((u) => storedDevice.users.push(u));
    }

    if (device.address) {
      storedDevice.address = device.address;
    }

    if (device.description) {
      storedDevice.description = device.description;
    }

    if (device.name) {
      storedDevice.name = device.name;
    }

    storedDevice.updatedAt = new Date().toISOString();
    await this.repo.save(storedDevice);
    return;
  }

  async create(
    user: User,
    data: CreateDeviceDto,
  ): Promise<Device & { id: string }> {
    if (!user) {
      throw new BadRequestException('The device must be create by the user');
    }

    const device = this.repo.create({
      users: [user],
      active: false,
      name: data.name,
      description: data.description,
      createdAt: new Date().toISOString(),
    });

    const { id } = await this.repo.save(device);

    return { ...device, id };
  }

  async registerDevice({
    id,
    address,
    lang,
  }: {
    id: string;
    address: string;
    lang: string;
  }) {
    const device = await this.findOne(id, lang);

    if (device.active) {
      throw new BadRequestException(
        this.i18n.translate('device.errors.already-registered', { lang }),
      );
    }

    Object.assign(device, { address, active: true });

    return this.repo.save(device);
  }

  async findOne(id: string, lang: string): Promise<Device> {
    if (!id) {
      return null;
    }

    const device = await this.repo.findOneBy({ id });

    if (!device) {
      throw new NotFoundException(
        this.i18n.translate('device.errors.not-found', { lang }),
      );
    }

    return device;
  }

  getUserDevices(user: User): Promise<Device[]> {
    if (!user) {
      return null;
    }

    return this.repo.findBy({ users: [user] });
  }

  async assignUser(user: User, id: string): Promise<Device> {
    const device = await this.repo.findOneBy({ id });

    if (!device) {
      throw new NotFoundException('Device not found');
    }

    if (device.users.find((u) => u.id === user.id)) {
      throw new BadRequestException('User is already assigned to the device');
    }

    device.users.push(user);

    return this.repo.save(device);
  }
}
