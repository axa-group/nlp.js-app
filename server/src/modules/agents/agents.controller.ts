import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { AgentsService } from './agents.service';

@Controller('agents')
export class AgentsController {
  constructor(private service: AgentsService) {}

  @Get()
  public async get() {
    return await this.service.findAll();
  }

  @Post()
  public async post(@Body() entityDto) {
    return await this.service.create(entityDto);
  }

  @Get(':id')
  public async getById(@Param('id') id: string) {
    return await this.service.findById(id);
  }
}
