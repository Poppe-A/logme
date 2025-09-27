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
    console.log('--- login method');
    const user = await this.userService.findByEmail(email, true);
    console.log('--- user ', user);
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
    this.setCookies(response, refreshToken);

    return {
      accessToken,
      user: { firstname: user.firstname, lastname: user.lastname, id: user.id },
    };
  }

  logout(res: Response) {
    res.cookie('refreshToken', '', {
      httpOnly: true,
      // path: '/',
      secure: false, // todo update for prod
      sameSite: 'lax',
      // maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      expires: new Date(0),
    });

    return;
  }

  async generateAuthTokens(userId: number): Promise<IAuthTokens> {
    const accessSecret = this.configService.get<string>('ACCESS_JWT_SECRET');
    const refreshSecret = this.configService.get<string>('REFRESH_JWT_SECRET');

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
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      path: '/',
      secure: false, // todo update for prod
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });
  }

  validateJwt(token: string): any {
    try {
      return this.jwtService.verify(token);
    } catch (e) {
      console.log('--- validate token err', e);
      return null;
    }
  }

  async refreshTokens(res: Response, userId: number) {
    const user = await this.userService.findById(userId);

    if (!user) {
      throw new BadRequestException('User not existing');
    }
    // 2. Valider le refresh token en base // todo token in service create guard
    // const valid = await this.isRefreshTokenValid(payload.sub, refreshToken);
    // if (!valid) {
    //   throw new UnauthorizedException('Invalid refresh token');
    // }

    // 3. Générer et stocker les nouveaux tokens (rotation)
    const { accessToken, refreshToken } = await this.generateAuthTokens(userId);
    // Mise à jour cookie avec nouveau refresh token
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      path: '/', // todo update for prod
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'lax',
    });
    return {
      accessToken,
      user: { firstname: user.firstname, lastname: user.lastname, id: user.id },
    };
  }
}
