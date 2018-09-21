import { Module } from '@nestjs/common';

import { UiSettingsController } from './ui-settings.controller';
import { UiSettingsService } from './ui-settings.service';

@Module({
  exports: [UiSettingsService],
  providers: [UiSettingsService],
  controllers: [UiSettingsController]
})
export class UiSettingsModule {}
