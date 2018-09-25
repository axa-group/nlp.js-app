import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { settings } from '../settings';

export class DocsHelper {

  public static setup(app) {
    const options = new DocumentBuilder()
      .setTitle('Dost API docs')
      .setDescription('Dost backend documentation')
      .setVersion('0.0.4')
      .setBasePath('api')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, options);

    const docsPath = `${settings.apiPrefix}/docs`;

    SwaggerModule.setup(docsPath, app, document);

    return docsPath;
  }
}
