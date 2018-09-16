import * as pick from 'lodash.pick';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { CryptoService } from '../crypto/crypto.service';
import { UsersService } from '../users/users.service';
import { LoginPayload } from './login-payload.interface';
import { settings } from './settings';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly cryptoService: CryptoService
  ) {}

  public async login(payload: LoginPayload): Promise<object> {
    const user = await this.validateUser(payload);

    if (user) {
      if (await this.cryptoService.checkPasswords(user.password, payload.password)) {
        const jwtPayload = pick(user, settings.userJwtPayloadFields);

        return { access_token: this.jwtService.sign(jwtPayload) };
      }
      throw new BadRequestException();
    }
    throw new NotFoundException();
  }

  public async validateUser(payload: LoginPayload): Promise<any> {
    const query = { where: { username: payload.username } };

    return await this.usersService.findOneByQuery(query);
  }
}
