import { Entity, Column } from 'typeorm';
import { ApiModelProperty } from '@nestjs/swagger';

@Entity()
export class Language {
  @Column()
  @ApiModelProperty({ example: 'en_US' })
  id: string;

  @Column()
  @ApiModelProperty({ example: 'en' })
  code: string;

  @Column()
  @ApiModelProperty({ example: 'English' })
  text: string;

  @Column()
  @ApiModelProperty({ example: true, default: true })
  isDefault?: boolean;
}
