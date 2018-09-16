import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { AuthService } from './auth.service';
import { LoginPayload } from './login-payload.interface';
import { settings } from './settings';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: settings.secret
    });
  }

  public async validate(payload: LoginPayload) {
    const user = await this.authService.validateUser(payload);

    if (user) {
      return payload;
    }

    throw new UnauthorizedException();
  }
}
