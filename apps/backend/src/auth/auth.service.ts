import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { IAuthTokens, RegisterUserDto } from './auth.types';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(registerUserDto: RegisterUserDto) {
    const existingUser = await this.userService.findByEmail(
      registerUserDto.email,
    );

    if (existingUser) {
      throw new BadRequestException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(registerUserDto.password, 10);

    return this.userService.create({
      ...registerUserDto,
      password: hashedPassword,
    });
  }

  async login(
    email: User['email'],
    password: User['password'],
    response: Response,
  ) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const { accessToken, refreshToken } = await this.generateAuthTokens(
      user.id,
    );
    console.log('refre', refreshToken);
    this.setCookies(response, refreshToken);

    return { accessToken };
  }

  async generateAuthTokens(userId: number): Promise<IAuthTokens> {
    const accessSecret = this.configService.get<string>('ACCESS_JWT_SECRET');
    const refreshSecret = this.configService.get<string>('REFRESH_JWT_SECRET');

    console.log('--- accessSecret', refreshSecret);
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId },
        { secret: accessSecret, expiresIn: '15m' },
      ),
      this.jwtService.signAsync(
        { sub: userId },
        { secret: refreshSecret, expiresIn: '7d' },
      ),
    ]);
    return { accessToken, refreshToken };
  }

  private setCookies(res: Response, refreshToken: string) {
    const commonOptions = {
      httpOnly: true,
      // secure: true, // todo update for prod
      // sameSite: 'strict' as const,
    };

    console.log('setcoo');
    res.cookie('refreshToken', refreshToken, {
      ...commonOptions,
      path: '/auth/refresh',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });
    // console.log('setcoo', res);
  }

  validateJwt(token: string): any {
    try {
      return this.jwtService.verify(token);
    } catch (e) {
      console.log('--- err', e);
      return null;
    }
  }

  async refreshTokens(res: Response, userId: number) {
    // 2. Valider le refresh token en base // todo token in service create guard
    // const valid = await this.isRefreshTokenValid(payload.sub, refreshToken);
    // if (!valid) {
    //   throw new UnauthorizedException('Invalid refresh token');
    // }

    // 3. Générer et stocker les nouveaux tokens (rotation)
    console.log('--- token ok');
    const { accessToken, refreshToken } = await this.generateAuthTokens(userId);
    // Mise à jour cookie avec nouveau refresh token
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      path: '/auth/refresh',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'strict',
    });
    return { accessToken };
  }
}
