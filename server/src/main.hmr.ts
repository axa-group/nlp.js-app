import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { settings } from './settings';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  await app.listen(settings.port);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
