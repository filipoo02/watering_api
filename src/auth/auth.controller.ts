import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dtos/auth-credentials.dto';
import { StrategyNameEnum } from './types/strategy-name.enum';
import { TokensInterface } from './types/tokens.interface';
import { User } from './users/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() body: AuthCredentialsDto) {
    const user = await this.authService.singup(body.email, body.password);
    return user;
  }

  @Post('/signin')
  @HttpCode(HttpStatus.OK)
  singin(@Body() body: AuthCredentialsDto): Promise<TokensInterface> {
    return this.authService.singin(body.email, body.password);
  }

  @UseGuards(AuthGuard(StrategyNameEnum.JWT_AT))
  @Post('/logout')
  @HttpCode(HttpStatus.OK)
  logout(@Req() req: Request) {
    const user = req.user as User;
    this.authService.logout(user.id);
  }
}
