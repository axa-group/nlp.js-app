import { ApiModelProperty } from '@nestjs/swagger';

import { Fallback } from '../../../entities/fallback.entity';
import { Language } from '../../../entities/language.entity';
import { WebhookSettings } from '../../../entities/webhook-settings.entity';

export class NewAgentDto {
  @ApiModelProperty()
  name: string;

  @ApiModelProperty()
  description: string;

  @ApiModelProperty({ type: [Language] })
  languages: Language[];

  @ApiModelProperty()
  domainThreshold: number;

  @ApiModelProperty({ type: [Fallback] })
  fallbackResponses: Fallback[];

  @ApiModelProperty()
  webhookSettings: WebhookSettings;
}
