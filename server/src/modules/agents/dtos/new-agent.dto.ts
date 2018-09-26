import { ApiModelProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, Max, Min, ValidateNested } from 'class-validator';

import { Fallback } from '../../../entities/fallback.entity';
import { Language } from '../../../entities/language.entity';
import { WebhookSettings } from '../../../entities/webhook-settings.entity';

export class NewAgentDto {
  @ApiModelProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiModelProperty()
  @IsString()
  description: string;

  @ApiModelProperty({ type: [Language] })
  @ValidateNested({ each: true })
  @Type(() => Language)
  languages: Language[];

  @ApiModelProperty()
  @IsNumber()
  @Min(0)
  @Max(1)
  domainThreshold: number;

  @ApiModelProperty({ type: [Fallback] })
  @ValidateNested({ each: true })
  @Type(() => Fallback)
  fallbackResponses: Fallback[];

  @ApiModelProperty({ type: WebhookSettings })
  @ValidateNested()
  @Type(() => WebhookSettings)
  webhookSettings: WebhookSettings;
}
