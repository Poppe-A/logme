import { Response, Request } from 'express';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto, RequestWithMetadatas } from './auth.types';
import { Public } from '../common/decorators/public.decorators';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.register(registerUserDto);
  }

  @Public()
  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.login(email, password, response);
  }

  @Post('logout') // todo voir si il faut des conditions pour logout
  logout(@Res() res: Response) {
    // Supprime le cookie en le mettant à blanc et en le faisant expirer
    res.cookie('refreshToken', '', {
      httpOnly: true,
      secure: true, // à garder en prod (HTTPS)
      sameSite: 'strict',
      expires: new Date(0), // expire immédiatement
    });

    return res.send({ message: 'Logged out' });
  }

  @Public()
  @UseGuards(AuthGuard('jwt-refresh'))
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Req() req: RequestWithMetadatas,
    @Res({ passthrough: true }) res: Response,
  ) {
    console.log('refresh route');
    const { accessToken, user } = await this.authService.refreshTokens(
      res,
      req.user.userId,
    );

    return { accessToken, user };
  }
}
