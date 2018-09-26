import { IsBoolean, IsIn, IsOptional, IsString } from 'class-validator';
import { Entity, Column } from 'typeorm';
import { ApiModelProperty } from '@nestjs/swagger';

import { langList } from '../constants';

@Entity()
export class Language {
  @Column()
  @ApiModelProperty({ example: langList[0] })
  @IsIn(langList)
  id: string;

  @Column()
  @ApiModelProperty({ example: 'en' })
  @IsString()
  code: string;

  @Column()
  @ApiModelProperty({ example: 'English' })
  @IsString()
  text: string;

  @Column()
  @ApiModelProperty({ example: true, default: true })
  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;
}
