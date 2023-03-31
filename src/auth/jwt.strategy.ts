import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';
import { JwtPayloadInterface } from './types/jwt-payload.interface';
import { StrategyNameEnum } from './types/strategy-name.enum';
import { User } from './users/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(
  Strategy,
  StrategyNameEnum.JWT_AT,
) {
  constructor(
    @InjectRepository(User) private repo: Repository<User>,
    private config: ConfigService,
  ) {
    super({
      secretOrKey: config.get<string>('JWT_SECRET'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: JwtPayloadInterface): Promise<User> {
    const { email } = payload;
    const user = await this.repo.findOneBy({ email });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
