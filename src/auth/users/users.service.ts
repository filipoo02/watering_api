import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from 'src/auth/users/user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  create(email: string, password: string) {
    const user = this.repo.create({
      email,
      password,
      createdAt: new Date().toISOString(),
    });

    this.repo.save(user);

    return user;
  }

  find(email: string) {
    return this.repo.findBy({ email });
  }

  async update(userId: number, data: Partial<User>) {
    const user = await this.findOne(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    Object.assign(user, data);

    return this.repo.save(user);
  }

  findOne(id: number) {
    if (!id) {
      return null;
    }

    return this.repo.findOneBy({ id });
  }

  async remove(id: number) {
    const user = await this.findOne(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.repo.remove(user);
  }
}
