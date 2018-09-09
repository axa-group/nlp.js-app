import { NestFactory } from '@nestjs/core';

import { settings } from './settings';
import { AppModule } from './app.module';
import { LoggerService } from './modules/shared/services/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new LoggerService('Main')
  });

  app.setGlobalPrefix(settings.apiPrefix);

  await app.listen(settings.port);
}
bootstrap();
