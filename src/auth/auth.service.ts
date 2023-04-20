import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/auth/users/users.service';
import { JwtPayloadInterface } from './types/jwt-payload.interface';
import { TokensInterface } from './types/tokens.interface';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  logout(userId: number) {
    this.usersService.update(userId, { hashedRt: null });
  }

  async refresh(userId: number, rt: string) {
    const user = await this.usersService.findOne(userId);

    if (!user) {
      throw new ForbiddenException('Access denied');
    }

    const rtMatches = await bcrypt.compare(rt, user.hashedRt);

    if (!rtMatches) {
      throw new ForbiddenException('Access denied');
    }

    const tokens = await this.createTokens(user.id, user.email);

    const hashedRt = await this.hashData(tokens.refresh_token);
    this.usersService.update(user.id, { hashedRt });

    return tokens;
  }

  async singup(email: string, password: string): Promise<TokensInterface> {
    const users = await this.usersService.find(email);

    if (users.length) {
      throw new BadRequestException('Email address is used');
    }

    const hashedPassword = await this.hashData(password);
    const user = await this.usersService.create(email, hashedPassword);

    const tokens = await this.createTokens(user.id, user.email);

    const hashedRt = await this.hashData(tokens.refresh_token);
    this.usersService.update(user.id, { hashedRt });

    return tokens;
  }

  async singin(email: string, password: string): Promise<TokensInterface> {
    const [user] = await this.usersService.find(email);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (!(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const tokens = await this.createTokens(user.id, user.email);

    const hashedRt = await this.hashData(tokens.refresh_token);
    this.usersService.update(user.id, { hashedRt });

    return tokens;
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
    const result = await bcrypt.hash(data, salt);

    return result;
  }
}
