import { Test, TestingModule } from '@nestjs/testing';

import { settings } from './settings';
import { UiSettingsService } from './ui-settings.service';
import { UiSettingsController } from './ui-settings.controller';

describe('UiSettingsController', () => {
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [UiSettingsController],
      providers: [UiSettingsService]
    }).compile();
  });

  describe('Get settings', () => {
    it('should return ui settings', async () => {
      const controller = module.get<UiSettingsController>(UiSettingsController);

      expect(await controller.get()).toBe(settings);
    });
  });
});
