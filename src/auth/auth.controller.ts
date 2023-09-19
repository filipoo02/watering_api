import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {I18n, I18nContext} from 'nestjs-i18n';

import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dtos/auth-credentials.dto';
import { StrategyNameEnum } from './types/strategy-name.enum';
import { User } from './users/user.entity';
import { JwtPayloadInterface } from './types/jwt-payload.interface';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { RefreshToken } from 'src/decorators/refresh-token.decorator';
import { Public } from 'src/decorators/public.decorator';
import { AuthCredentialsInterface } from './types/auth-credentials.interface';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('/signup')
  @HttpCode(HttpStatus.CREATED)
  signup(
    @Body() body: AuthCredentialsDto,
  ): Promise<AuthCredentialsInterface> {
    return this.authService.singup(body.email, body.password);
  }

  @Public()
  @Post('/signin')
  @HttpCode(HttpStatus.OK)
  singin(
    @Body() body: AuthCredentialsDto,
    @I18n() i18n: I18nContext,
  ): Promise<AuthCredentialsInterface> {
    return this.authService.singin(body.email, body.password, i18n.lang);
  }

  @Post('/logout')
  @HttpCode(HttpStatus.OK)
  logout(@CurrentUser() user: User) {
    return this.authService.logout(user.id);
  }

  @Public()
  @UseGuards(AuthGuard(StrategyNameEnum.JWT_RT))
  @Post('/refresh')
  @HttpCode(HttpStatus.OK)
  refreshToken(
    @CurrentUser() payload: JwtPayloadInterface,
    @RefreshToken() rt: string,
    @I18n() i18n: I18nContext,
  ) {
    return this.authService.refresh(payload.userId, rt, i18n.lang);
  }

  @Get('/whoami')
  currentUser(@CurrentUser() user: User) {
    return user;
  }
}
