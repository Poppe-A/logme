import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../auth.types';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly configService: ConfigService) {
    console.log('constructor strategy');

    const jwtSecret = configService.get<string>('ACCESS_JWT_SECRET', {
      infer: true,
    });
    console.log('--- JWT STRATEGY', jwtSecret);
    if (!jwtSecret) {
      throw new Error(
        "JWT_ACCESS_SECRET n'est pas défini dans la configuration.",
      );
    }
    super({
      //   jwtFromRequest: (req: Request) => {
      //     return req.headers.authorization?.replace('Bearer ', '') || null;
      //   },
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtSecret,
    });
  }

  validate(payload: JwtPayload) {
    console.log('validate strategy');

    return { userId: payload.sub };
  }
}
