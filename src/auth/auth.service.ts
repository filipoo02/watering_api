import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { I18nService } from 'nestjs-i18n';

import { UsersService } from 'src/auth/users/users.service';
import { JwtPayloadInterface } from './types/jwt-payload.interface';
import { TokensInterface } from './types/tokens.interface';
import { AuthCredentialsInterface } from './types/auth-credentials.interface';
import { AuthCredentialModel } from './models/auth-credential.model';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private config: ConfigService,
    private i18n: I18nService,
  ) {}

  logout(userId: number) {
    this.usersService.update(userId, { hashedRt: null });
  }

  async refresh(userId: number, rt: string, lang: string) {
    const user = await this.usersService.findOne(userId);

    if (!user || !user.hashedRt) {
      throw new ForbiddenException(
        this.i18n.translate('auth.errors.access_denied', { lang }),
      );
    }

    const rtMatches = await bcrypt.compare(rt, user.hashedRt);

    if (!rtMatches) {
      throw new ForbiddenException(
        this.i18n.translate('auth.errors.access_denied', { lang }),
      );
    }

    const tokens = await this.createTokens(user.id, user.email);

    const hashedRt = await this.hashData(tokens.refresh_token);
    this.usersService.update(user.id, { hashedRt });

    return tokens;
  }

  async singup(
    email: string,
    password: string,
    lang: string,
  ): Promise<AuthCredentialsInterface> {
    const users = await this.usersService.find(email);

    if (users.length) {
      throw new BadRequestException(
        this.i18n.translate('auth.errors.email_in_use', { lang }),
      );
    }

    const hashedPassword = await this.hashData(password);
    const user = await this.usersService.create(email, hashedPassword);

    const tokens = await this.createTokens(user.id, user.email);

    const hashedRt = await this.hashData(tokens.refresh_token);
    await this.usersService.update(user.id, { hashedRt });

    return AuthCredentialModel.create(tokens, user);
  }

  async singin(
    email: string,
    password: string,
    lang: string,
  ): Promise<AuthCredentialsInterface> {
    const [user] = await this.usersService.find(email);

    if (!user) {
      throw new UnauthorizedException(
        this.i18n.translate('auth.errors.invalid_credentials', { lang }),
      );
    }

    if (!(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException(
        this.i18n.translate('auth.errors.invalid_credentials', { lang }),
      );
    }

    const tokens = await this.createTokens(user.id, user.email);

    const hashedRt = await this.hashData(tokens.refresh_token);
    this.usersService.update(user.id, { hashedRt });

    return AuthCredentialModel.create(tokens, user);
  }

  private async createTokens(
    userId: number,
    email: string,
  ): Promise<TokensInterface> {
    const payload: JwtPayloadInterface = {
      email,
      userId,
    };

    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(payload, {
        expiresIn: 60 * 15,
        secret: this.config.get<string>('JWT_SECRET'),
      }),
      this.jwtService.signAsync(payload, {
        expiresIn: 60 * 60 * 24 * 7,
        secret: this.config.get<string>('JWT_REFRESH_SECRET'),
      }),
    ]);

    return {
      refresh_token: rt,
      access_token: at,
    };
  }

  async hashData(data: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(data, salt);
  }
}
