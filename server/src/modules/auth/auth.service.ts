import * as moment from 'moment';
import * as pick from 'lodash.pick';
import * as randToken from 'rand-token';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { Auth } from '../../entities/auth.entity';
import { CryptoService } from '../crypto/crypto.service';
import { UsersService } from '../users/users.service';
import { RawTokensResponse } from './interfaces/raw-tokens-response.interface';
import { settings } from './settings';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth) private readonly repository: Repository<Auth>,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly cryptoService: CryptoService
  ) {}

  public async login(payload): Promise<RawTokensResponse> {
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

    if (this.hasValidExpiryTime(tokenPayload)) {
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

  public async getRefreshTokenPayload(refreshToken) {
    return await this.findOneByQuery({ where: { refreshToken } });
  }

  private generateAccessToken(payload) {
    const jwtPayload = pick(payload, settings.userJwtPayloadFields);

    return this.jwtService.sign(jwtPayload);
  }

  private hasValidExpiryTime(tokenPayload) {
    return tokenPayload && moment().toDate().getTime() < tokenPayload.expiresAt.getTime();
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

  private async findOneByQuery(query): Promise<Auth> {
    return await this.repository.findOne(query);
  }
}
