import { hash, compare } from 'bcrypt';
import { Injectable } from '@nestjs/common';

import { settings } from '../auth/settings';

@Injectable()
export class CryptoService {

  public async checkPasswords(hashedPassword, plainPassword) {
    return await compare(plainPassword, hashedPassword);
  }

  public async generateHash(word) {
    return await hash(word, settings.saltRounds);
  }
}
