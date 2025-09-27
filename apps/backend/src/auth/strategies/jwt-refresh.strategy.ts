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

    if (!jwtSecret) {
      throw new Error(
        "JWT_REFRESH_SECRET n'est pas défini dans la configuration.",
      );
    }
    super({
      jwtFromRequest: (req: RequestWithMetadatas) => {
        console.log('--refresh get token', req?.cookies);
        return req?.cookies?.refreshToken;
      },
      secretOrKey: jwtSecret,
      passReqToCallback: true,
    });
  }

  validate(req: RequestWithMetadatas, payload: JwtPayload) {
    console.log('--- refresh validate');
    // Vérification que refresh token correspond bien à utilisateur
    const refreshToken = req.cookies?.refreshToken;
    // console.log('Extracted refresh token:', refreshTokenExtractor(req));
    console.log('refresh token', refreshToken);
    if (!refreshToken) {
      throw new UnauthorizedException('Missing refresh token');
    }
    // ici tu peux valider en base que refreshToken est valide
    return { userId: payload.sub };
  }
}
