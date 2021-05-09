import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { SignUp } from './dto/sign-up.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { UserService } from '../user/user.service';
import { IUser } from '../user/user.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(signUp: SignUp): Promise<any> {
    const user = await this.userService.create(signUp);
    return {
      _id: user._id,
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
      lastConnection: user.lastConnection
    }
  }

  async login(email: string, password: string): Promise<any> {
    let user: IUser;
    try {
      user = await this.userService.findOne({ email: email } );
      user.lastConnection = new Date()
    } catch (err) {
      throw new UnauthorizedException(
        `There isn't any user with email: ${email}`,
      );
    }

    if (!(await this.userService.checkPassword(password, user.password))) {
      throw new UnauthorizedException(
        `Wrong password for user with email: ${email}`,
      );
    }
    return {
      _id: user._id,
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
      lastConnection: user.lastConnection
    };
  }

  async verifyPayload(payload: JwtPayload): Promise<any> {
    let user: IUser;

    try {
      user = await this.userService.findOne({ where: { email: payload.sub } });
    } catch (error) {
      throw new UnauthorizedException(
        `There isn't any user with email: ${payload.sub}`,
      );
    }
    return {
      _id: user._id,
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
      lastConnection: user.lastConnection
    }
  }

  signToken(user: IUser): string {
    const payload = {
      email: user.email,
      role: user.role,
      _id: user._id
    };
    return this.jwtService.sign(payload);
  }
}
