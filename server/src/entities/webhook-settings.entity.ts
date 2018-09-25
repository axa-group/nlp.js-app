import { ApiModelProperty } from '@nestjs/swagger';
import { Entity, Column } from 'typeorm';

@Entity()
export class WebhookSettings {
  @Column()
  @ApiModelProperty({ example: true, default: false })
  isEnabled: boolean;

  @Column()
  @ApiModelProperty({ example: 'get' })
  verb: string;

  @Column()
  @ApiModelProperty({ example: 'api/my-webhook-1' })
  url: string;
}
