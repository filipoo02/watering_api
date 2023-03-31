import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayloadInterface } from './types/jwt-payload.interface';
import { Request } from 'express';
import { StrategyNameEnum } from './types/strategy-name.enum';

@Injectable()
export class RtStrategy extends PassportStrategy(
  Strategy,
  StrategyNameEnum.JWT_RT,
) {
  constructor(private config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get<string>('JWT_REFRESH_SECRET'),
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: JwtPayloadInterface) {
    const refreshToken = req.get('authorization').replace('Bearer', '').trim();
    return {
      refreshToken,
      ...payload,
    };
  }
}
