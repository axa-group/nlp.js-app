import * as path from 'path';
import { Repository, UpdateResult } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { NoTrainedAgentException } from '../../exceptions/no-trained-agent.exception';
import { Agent } from '../../entities/agent.entity';
import { NlpService } from '../nlp/nlp.service';
import { LoggerService } from '../shared/services/logger.service';
import { UsersService } from '../users/users.service';
import { PartialAgentDto } from './dtos/partial-agent.dto';
import { modelsPath, status } from './settings';

@Injectable()
export class AgentsService {
  private readonly logger: LoggerService = new LoggerService(AgentsService.name);
  private manager;

  constructor(
    @InjectRepository(Agent) private readonly agentRepository: Repository<Agent>,
    private nlpService: NlpService,
    private usersService: UsersService
  ) {}

  public async create(newEntity, owner): Promise<Agent> {
    (newEntity as PartialAgentDto).owner = owner.id;

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
      owner: owner.id
    };
  }

  public async updateOne(criteria, partialEntity): Promise<UpdateResult> {
    return await this.agentRepository.update(criteria, partialEntity);
  }

  public async trainNlp(id: string, forceUpdate: boolean) {
    const agent = await this.agentRepository.findOne(id);
    const options = {
      languages: this.formatLanguages(agent.languages)
    };
    const manager = this.nlpService.initManager(options);
    const modelPath = this.getModelPath(agent.id);

    this.logger.log(`modelPath -> ${modelPath}`);

    await this.agentRepository.update(id, { status: status.training });

    this.nlpService.train(manager, agent, modelPath, forceUpdate).then(() => {
      this.manager = manager;
      this.agentRepository.update(id, { status: status.ready });
    });
  }

  public async processLine(id: string, line: string) {
    const agent = await this.agentRepository.findOne(id);

    if (agent.status === status.dumb) {
      throw new NoTrainedAgentException();
    }

    return await this.nlpService.processLine(line, this.manager);
  }

  private formatLanguages(rawLanguages) {
    const languages = [];

    rawLanguages.forEach(language => languages.push(language.code));

    return languages;
  }

  private getModelPath(id) {
    return path.join(modelsPath, `modelnlp-${id}.nlp`);
  }
}
