import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Agent } from '../../entities/agent.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class AgentsService {
  constructor(
    @InjectRepository(Agent) private readonly agentRepository: Repository<Agent>,
    private usersService: UsersService
  ) {}

  public async create(newEntity): Promise<Agent> {
    return await this.agentRepository.save(newEntity);
  }

  public async findAll(): Promise<Agent[]> {
    return await this.agentRepository.find();
  }

  public async findById(id: string): Promise<Agent> {
    const agent = await this.agentRepository.findOne(id);
    const owner = await this.usersService.findById(agent.owner.toString());

    return {
      ...agent,
      owner
    };
  }
}
