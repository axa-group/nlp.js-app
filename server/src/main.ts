import * as helmet from 'helmet';
import * as express from 'express';
import * as compression from 'compression';
import { NestFactory } from '@nestjs/core';

import { settings } from './settings';
import { AppModule } from './app.module';
import { LoggerService } from './modules/shared/services/logger.service';

async function bootstrap() {
  const instance: express.Application = express();

  instance.use(helmet());
  instance.use(compression());

  const app = await NestFactory.create(AppModule, instance, {
    logger: new LoggerService('Main')
  });

  app.setGlobalPrefix(settings.apiPrefix);

  await app.listen(settings.port);
}

bootstrap();
