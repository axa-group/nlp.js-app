import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Agent } from '../../entities/agent.entity';
import { NlpModule } from '../nlp/nlp.module';
import { UsersModule } from '../users/users.module';
import { AgentsController } from './agents.controller';
import { AgentsService } from './agents.service';

@Module({
  imports: [TypeOrmModule.forFeature([Agent]), UsersModule, NlpModule],
  providers: [AgentsService],
  controllers: [AgentsController]
})
export class AgentsModule {}
