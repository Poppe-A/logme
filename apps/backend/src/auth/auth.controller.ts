import { Response, Request } from 'express';
import {
  Body,
  Controller,
  Get,
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
    console.log('---- contro', process.env.JWT_SECRET);
    return this.authService.login(email, password, response);
  }

  @Get('test')
  test() {
    console.log('---- test');
  }

  @Public()
  @UseGuards(AuthGuard('jwt-refresh'))
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Req() req: RequestWithMetadatas,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken } = await this.authService.refreshTokens(
      res,
      req.user.userId,
    );

    return { accessToken };
  }
}
