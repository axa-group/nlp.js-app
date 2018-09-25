import { ApiModelProperty } from '@nestjs/swagger';
import { Entity, Column } from 'typeorm';

@Entity()
export class Fallback {
  @Column()
  @ApiModelProperty()
  text: string;

  @Column()
  @ApiModelProperty()
  lang: string;
}
