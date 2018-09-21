import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { NewAgentDto } from './dtos/new-agent.dto';
import { AgentsService } from './agents.service';

@Controller('agents')
export class AgentsController {
  constructor(private service: AgentsService) {}

  @Get()
  public async get() {
    return await this.service.findAll();
  }

  @Post()
  public async post(@Body() entityDto: NewAgentDto) {
    return await this.service.create(entityDto);
  }

  @Post()
  public async startTraining() {
    // TODO:
  }

  @Get(':id')
  public async getById(@Param('id') id: string) {
    return await this.service.findById(id);
  }
}
