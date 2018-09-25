import { ApiModelProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiModelProperty()
  password: string;
}
