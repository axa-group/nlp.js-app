import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { settings } from './settings';
import { NlpModule } from './modules/nlp/nlp.module';
import { UiSettingsModule } from './modules/ui-settings/ui-settings.module';
import { AuthModule } from './modules/auth/auth.module';
import { AgentsModule } from './modules/agents/agents.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [TypeOrmModule.forRoot(settings.db), AuthModule, UsersModule, AgentsModule, UiSettingsModule, NlpModule]
})
export class AppModule {}
