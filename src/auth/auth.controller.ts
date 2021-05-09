import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';

import { AuthUser } from '../user/user.decorator';
import { User } from '../user/user.schema';
import { AuthService } from './auth.service';
import { SignUp } from './dto/sign-up.dto';
import { JWTAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { SessionAuthGuard } from './guards/session-auth.guard';
import { IUser } from '../user/user.interface';
import { config } from '../../config';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() signUp: SignUp, @Res() resp: Response): Promise<Response> {
    const user = await this.authService.register(signUp);
    const token = this.authService.signToken(user);

    resp.setHeader('Authorization', `Bearer ${token}`);
    resp.cookie('token', token, {
      httpOnly: true,
      signed: true,
      sameSite: 'strict',
      secure: config.secure,
    });
    resp.send(user);

    return resp;
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  async login(@AuthUser() user: IUser, @Res() resp: Response): Promise<Response> {
    const token = this.authService.signToken(user);

    resp.setHeader('Authorization', `Bearer ${token}`);
    resp.cookie('token', token, {
      httpOnly: true,
      signed: true,
      sameSite: 'strict',
      secure: config.secure,
    });
    resp.send(user);

    return resp;
  }

  @Get('/me')
  @UseGuards(SessionAuthGuard, JWTAuthGuard)
  me(@AuthUser() user: User): User {
    console.log('ic')
    return user;
  }
}
