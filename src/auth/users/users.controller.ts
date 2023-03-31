import { Controller, NotFoundException, Param, Get } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('/:id')
  async findUser(@Param('id') id: string) {
    const user = await this.usersService.findOne(Number(id));

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}
