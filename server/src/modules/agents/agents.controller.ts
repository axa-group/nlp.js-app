import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../../guards/auth.guard';
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
  @UseGuards(JwtAuthGuard)
  public async post(@Body() entityDto: NewAgentDto, @Req() req) {
    return await this.service.create(entityDto, req.user);
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
