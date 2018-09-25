import { Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../../guards/auth.guard';
import { ParseBoolPipe } from '../../pipes/parse-bool.pipe';
import { NewAgentDto } from './dtos/new-agent.dto';
import { AgentsService } from './agents.service';

@Controller('agents')
export class AgentsController {
  constructor(private service: AgentsService) {}

  @Get()
  public async get() {
    return await this.service.findAll();
  }

  @Get(':id/status')
  public async getStatus(@Param('id') id: string) {
    const { status } = await this.service.findById(id);

    return status;
  }

  @Get(':id')
  public async getById(@Param('id') id: string) {
    return await this.service.findById(id);
  }

  @Post(':id/train')
  public async startTraining(@Param('id') id: string, @Query('forceUpdate', new ParseBoolPipe()) forceUpdate: boolean) {
    this.service.trainNlp(id, forceUpdate);
  }

  @Post(':id/process')
  public async processLine(@Param('id') id: string, @Body() body) {
    return await this.service.processLine(id, body.line);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  public async post(@Body() entityDto: NewAgentDto, @Req() req) {
    return await this.service.create(entityDto, req.user);
  }

  @Patch(':id')
  public async patch(@Param('id') id: string, @Body() partialEntity) {
    const forceUpdate = partialEntity.entities || partialEntity.intents;

    await this.service.updateOne(id, partialEntity);
    this.service.trainNlp(id, forceUpdate);
  }
}
