import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

import { Observable } from 'rxjs';
import { StrategyNameEnum } from 'src/auth/types/strategy-name.enum';

@Injectable()
export class AccessTokenGuard
  extends AuthGuard(StrategyNameEnum.JWT_AT)
  implements CanActivate
{
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    if (
      this.reflector.getAllAndOverride('isPublic', [
        context.getClass(),
        context.getHandler(),
      ])
    ) {
      return true;
    }

    return super.canActivate(context);
  }
}
