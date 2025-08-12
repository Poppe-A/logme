import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { JwtPayload, RequestWithMetadatas } from '../auth.types';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(private readonly configService: ConfigService) {
    console.log('constructor refresh strategy');

    const jwtSecret = configService.get<string>('REFRESH_JWT_SECRET', {
      infer: true,
    });

    console.log('jt refresh', jwtSecret);
    if (!jwtSecret) {
      throw new Error(
        "JWT_REFRESH_SECRET n'est pas défini dans la configuration.",
      );
    }
    super({
      jwtFromRequest: (req: RequestWithMetadatas) => {
        return req?.cookies?.refreshToken;
      },
      secretOrKey: jwtSecret,
      passReqToCallback: true,
    });
  }

  validate(req: RequestWithMetadatas, payload: JwtPayload) {
    // Vérification que refresh token correspond bien à utilisateur
    const refreshToken = req.cookies?.refreshToken;
    console.log('Cookies:', req.cookies);
    // console.log('Extracted refresh token:', refreshTokenExtractor(req));
    console.log('validate refresh strategy', refreshToken);
    if (!refreshToken) {
      throw new UnauthorizedException('Missing refresh token');
    }
    console.log('after ');
    // ici tu peux valider en base que refreshToken est valide
    return { userId: payload.sub };
  }
}
