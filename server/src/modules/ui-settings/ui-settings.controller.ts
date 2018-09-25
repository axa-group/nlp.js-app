import { Controller, Get } from '@nestjs/common';
import { ApiUseTags } from '@nestjs/swagger';

import { UiSettingsService } from './ui-settings.service';

@ApiUseTags('ui-settings')
@Controller('ui-settings')
export class UiSettingsController {
  constructor(private service: UiSettingsService) {}

  @Get()
  public get() {
    return this.service.get();
  }
}
