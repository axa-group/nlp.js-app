import { Module } from '@nestjs/common';

import { NlpService } from './nlp.service';

@Module({
  exports: [NlpService],
  providers: [NlpService]
})
export class NlpModule {}
