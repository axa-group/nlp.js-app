import * as helmet from 'helmet';
import * as express from 'express';
import * as compression from 'compression';
import { NestFactory } from '@nestjs/core';

import { settings } from './settings';
import { AppModule } from './app.module';

async function bootstrap() {
  const instance: express.Application = express();
  const app = await NestFactory.create(AppModule, instance);

  instance.use(helmet());
  instance.use(compression());

  app.setGlobalPrefix(settings.apiPrefix);

  await app.listen(settings.port);
}
bootstrap();
