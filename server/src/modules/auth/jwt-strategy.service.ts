import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { UsersService } from '../users/users.service';
import { LoginPayload } from './interfaces/login-payload.interface';
import { settings } from './settings';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: settings.secret
    });
  }

  public async validate(payload: LoginPayload) {
    const user = await this.usersService.findOneByUsername(payload.username);

    if (user) {
      return payload;
    }

    throw new UnauthorizedException();
  }
}
