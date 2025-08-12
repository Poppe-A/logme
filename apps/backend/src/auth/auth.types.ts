import { Request } from 'express';

export interface RegisterUserDto {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}

export interface IAuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface JwtPayload {
  sub: string;
  username: string;
  email?: string;
  iat?: number;
  exp?: number;
}

export interface RequestWithMetadatas extends Request {
  cookies: {
    refreshToken: string;
  };
  user: {
    userId: number;
  };
}
