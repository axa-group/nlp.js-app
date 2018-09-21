import { Controller, Get } from '@nestjs/common';

import { UiSettingsService } from './ui-settings.service';

@Controller('ui-settings')
export class UiSettingsController {
  constructor(private service: UiSettingsService) {}

  @Get()
  public get() {
    return this.service.get();
  }
}
