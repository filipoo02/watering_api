import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Device } from './device.entity';
import { User } from 'src/auth/users/user.entity';
import { randomUUID } from 'crypto';
import * as bcrypt from 'bcrypt';
import { DeviceCredentialsInterface } from './types/device-credentials.interface';
import {CreateDeviceDto} from './dtos/create-device.dto';

@Injectable()
export class DeviceService {
  constructor(@InjectRepository(Device) private repo: Repository<Device>) {}

  async update(id: string, device: Partial<Device>): Promise<Device> {
    const storedDevice = await this.findOne(id);

    if (!storedDevice) {
      throw new NotFoundException('Device not found');
    }

    if (device.users.length) {
      device.users.forEach((u) => storedDevice.users.push(u));
    }

    if (device.address) {
      storedDevice.address = device.address;
    }

    storedDevice.updatedAt = new Date().toISOString();

    return this.repo.save(storedDevice);
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

  async registerDevice({ id, address }: { id: string; address: string }) {
    const device = await this.findOne(id);

    if (!device) {
      throw new NotFoundException('Device not found');
    }

    if (device.active) {
      throw new BadRequestException('Device is registered');
    }

    Object.assign(device, { address, active: true });

    return this.repo.save(device);
  }

  findOne(id: string): Promise<Device> {
    if (!id) {
      return null;
    }

    return this.repo.findOneBy({ id, active: true });
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
