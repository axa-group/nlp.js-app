import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { settings } from './settings';

@Module({
  imports: [TypeOrmModule.forRoot(settings.db), UsersModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
