import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { settings } from './settings';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { AuthModule } from './modules/auth/auth.module';
import { AgentsModule } from './modules/agents/agents.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [TypeOrmModule.forRoot(settings.db), AuthModule, UsersModule, AgentsModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
