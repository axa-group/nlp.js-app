import { ApiModelProperty } from '@nestjs/swagger';

export class InputDto {
  @ApiModelProperty()
  line: string;
}
