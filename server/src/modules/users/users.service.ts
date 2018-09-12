import { Repository, UpdateResult } from 'typeorm';
import { DeleteResult } from 'typeorm/query-builder/result/DeleteResult';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from '../../entities/user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

  public async create(newEntity): Promise<User> {
    return await this.userRepository.save(newEntity);
  }

  public async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  public async findById(id: string): Promise<User> {
    return await this.userRepository.findOne(id);
  }

  public async updateOne(criteria, partialEntity): Promise<UpdateResult> {
    return await this.userRepository.update(criteria, partialEntity);
  }

  public async deleteOne(criteria): Promise<DeleteResult> {
    return await this.userRepository.delete(criteria);
  }
}
