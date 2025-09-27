import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../../common/decorators/public.decorators';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  // extends Passport authguard
  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    console.log('--- jwtAuth guard');
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      console.log('--- jwtAuth guard is public');
      return Promise.resolve(true); // accès libre
    }
    console.log('no public');
    // const can = await super.canActivate(context);
    return super.canActivate(context) as Promise<boolean>;
  }

  // handleRequest(err, user, info) {
  //   if (err || !user) {
  //     throw err || new UnauthorizedException();
  //   }
  //   return user;
  // }
}
