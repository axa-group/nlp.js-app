import { IsString } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class InputDto {
  @ApiModelProperty()
  @IsString()
  line: string;
}
