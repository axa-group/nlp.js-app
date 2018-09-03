import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { settings } from './settings';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  await app.listen(settings.port);
}
bootstrap();
