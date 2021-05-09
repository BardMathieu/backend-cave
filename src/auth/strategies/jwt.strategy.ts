import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';

import { AuthService } from '../auth.service';
import { User } from '../../user/user.entity';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { IUser } from '../../user/user.interface';
import { config } from '../../../config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.secret,
      ignoreExpiration: false,
      passReqToCallback: false,
    });
  }

  validate(payload: JwtPayload): Promise<IUser> {
    return this.authService.verifyPayload(payload);
  }
}
