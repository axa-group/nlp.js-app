import { Entity, Column } from 'typeorm';
import { IsBoolean, IsIn, IsOptional, IsString } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

import { webhookVerbList } from '../constants';

@Entity()
export class WebhookSettings {
  @Column()
  @ApiModelProperty({ example: true, default: false })
  @IsBoolean()
  isEnabled: boolean;

  @Column()
  @ApiModelProperty({ example: webhookVerbList[0] })
  @IsIn(webhookVerbList)
  @IsOptional()
  verb: string;

  @Column()
  @ApiModelProperty({ example: '/api/my-webhook-1' })
  @IsString()
  @IsOptional()
  url: string;
}
