import * as pick from 'lodash.pick';
import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from '../users/users.service';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  async signIn(payload: JwtPayload): Promise<object> {
    // TODO: encrypt and compare password
    const user = await this.validateUser(payload);

    if (user) {
      const jwtPayload = pick(user, ['username', 'role']);

      return {
        access_token: this.jwtService.sign(jwtPayload)
      };
    }
    throw new NotFoundException();
  }

  async validateUser(payload: JwtPayload): Promise<any> {
    const query = { where: { username: payload.username } };
    const user = await this.usersService.findOneByQuery(query);

    return user;
  }
}
