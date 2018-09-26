import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { ApiBearerAuth, ApiImplicitQuery, ApiUseTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '../../guards/auth.guard';
import { ParseBoolPipe } from '../../pipes/parse-bool.pipe';
import { validationLevel } from '../../settings';
import { InputDto } from './dtos/input.dto';
import { NewAgentDto } from './dtos/new-agent.dto';
import { AgentsService } from './agents.service';

@ApiBearerAuth()
@ApiUseTags('agents')
@Controller('agents')
@UsePipes(new ValidationPipe(validationLevel.strict))
export class AgentsController {
  constructor(private service: AgentsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  public async get() {
    return await this.service.findAll();
  }

  @Get(':id/status')
  @UseGuards(JwtAuthGuard)
  public async getStatus(@Param('id') id: string) {
    const { status } = await this.service.findById(id);

    return { status };
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  public async getById(@Param('id') id: string) {
    return await this.service.findById(id);
  }

  @Post(':id/train')
  @UseGuards(JwtAuthGuard)
  @ApiImplicitQuery({ name: 'forceUpdate', type: Boolean, required: false })
  public async startTraining(@Param('id') id: string, @Query('forceUpdate', new ParseBoolPipe()) forceUpdate: boolean) {
    this.service.trainNlp(id, forceUpdate);
  }

  @Post(':id/process')
  @UseGuards(JwtAuthGuard)
  public async processLine(@Param('id') id: string, @Body() body: InputDto) {
    return await this.service.processLine(id, body.line);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  public async post(@Body() entityDto: NewAgentDto, @Req() req) {
    return await this.service.create(entityDto, req.user);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  public async patch(@Param('id') id: string, @Body() partialEntity) {
    const forceUpdate = partialEntity.entities || partialEntity.intents;

    await this.service.updateOne(id, partialEntity);
    this.service.trainNlp(id, forceUpdate);
  }
}
