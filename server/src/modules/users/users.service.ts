import { Repository, UpdateResult } from 'typeorm';
import { DeleteResult } from 'typeorm/query-builder/result/DeleteResult';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { UserAlreadyExistsException } from '../../exceptions/user-already-exists.exception';
import { CryptoService } from '../crypto/crypto.service';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly cryptoService: CryptoService
  ) {}

  public async create(newEntity): Promise<User> {
    const { username, email } = newEntity;
    const options = { where: { $or: [{ email }, { username }] } };

    const existingUser = await this.userRepository.find(options);

    if (existingUser && existingUser.length) {
      throw new UserAlreadyExistsException();
    }

    newEntity.password = await this.cryptoService.generateHash(newEntity.password);

    return await this.userRepository.save(newEntity);
  }

  public async findAll(query: object): Promise<User[]> {
    return await this.userRepository.find(query);
  }

  public async findById(id: string): Promise<User> {
    return await this.userRepository.findOne(id);
  }

  public async findOneByQuery(query): Promise<User> {
    return await this.userRepository.findOne(query);
  }

  public async findOneByUsername(username): Promise<User> {
    const query = { where: { username } };

    return await this.findOneByQuery(query);
  }

  public async changePassword(id, plainPassword) {
    const password = await this.cryptoService.generateHash(plainPassword);

    return await this.updateOne(id, { password });
  }

  public async updateOne(criteria, partialEntity): Promise<UpdateResult> {
    return await this.userRepository.update(criteria, partialEntity);
  }

  public async deleteOne(criteria): Promise<DeleteResult> {
    return await this.userRepository.delete(criteria);
  }
}
