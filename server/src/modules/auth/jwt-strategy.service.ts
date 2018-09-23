import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { UsersService } from '../users/users.service';
import { LoginDto } from './dtos/login.dto';
import { settings } from './settings';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: settings.secret
    });
  }

  public async validate(loginDto: LoginDto) {
    const user = await this.usersService.findOneByUsername(loginDto.username);

    if (user) {
      return loginDto;
    }

    throw new UnauthorizedException();
  }
}
