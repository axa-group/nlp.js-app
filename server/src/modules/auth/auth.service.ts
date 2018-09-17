import * as moment from 'moment';
import * as pick from 'lodash.pick';
import * as randToken from 'rand-token';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { CryptoService } from '../crypto/crypto.service';
import { UsersService } from '../users/users.service';
import { settings } from './settings';
import { Auth } from './auth.entity';
import { LoginPayload } from './login-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth) private readonly repository: Repository<Auth>,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly cryptoService: CryptoService
  ) {}

  public async login(payload: LoginPayload): Promise<object> {
    const user = await this.usersService.findOneByUsername(payload.username);

    if (user) {
      if (await this.cryptoService.checkPasswords(user.password, payload.password)) {
        const accessToken = this.generateAccessToken(user);
        const refreshTokenPayload = this.generateRefreshTokenPayload(user.username);
        const refreshResponse = await this.repository.save(refreshTokenPayload);

        return { accessToken, refreshToken: refreshResponse.refreshToken };
      }
      throw new BadRequestException();
    }
    throw new NotFoundException();
  }

  public async refreshAccessToken(refreshToken) {
    const tokenPayload = await this.getRefreshTokenPayload(refreshToken);

    if(tokenPayload && moment().toDate().getTime() < tokenPayload.expiresAt.getTime()) {
      const user = await this.usersService.findOneByUsername(tokenPayload.username);

      return this.generateAccessToken(user);
    }

    // TODO: add cron to empty expired tokens

    throw new UnauthorizedException();
  }

  public async rejectToken(refreshToken) {
    const query = { refreshToken };

    return await this.repository.delete(query);
  }

  private generateAccessToken(payload) {
    const jwtPayload = pick(payload, settings.userJwtPayloadFields);

    return this.jwtService.sign(jwtPayload);
  }

  private generateRefreshTokenPayload(username) {
    const refreshToken = randToken.uid(settings.refreshTokenLength);
    const nextExpiryTime = moment().add(settings.refreshExpiresIn, 'seconds');

    return {
      username,
      refreshToken,
      expiresAt: nextExpiryTime.toDate()
    };
  }

  private async getRefreshTokenPayload(refreshToken) {
    return await this.findOneByQuery({ where: { refreshToken } });
  }

  private async findOneByQuery(query): Promise<Auth> {
    return await this.repository.findOne(query);
  }
}
