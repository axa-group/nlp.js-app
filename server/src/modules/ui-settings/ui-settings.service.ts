import { Injectable } from '@nestjs/common';

import { settings } from './settings';

@Injectable()
export class UiSettingsService {
  public async get() {
    return settings;
  }
}
