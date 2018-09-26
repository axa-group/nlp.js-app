import { Entity, Column } from 'typeorm';
import { IsIn, IsString } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

import { langList } from '../constants';

@Entity()
export class Fallback {
  @Column()
  @ApiModelProperty()
  @IsString()
  text: string;

  @Column()
  @ApiModelProperty({ example: langList[0] })
  @IsString()
  @IsIn(langList)
  lang: string;
}
