import { ApiModelProperty } from '@nestjs/swagger';

export class PatchUserDto {
  @ApiModelProperty()
  name: string;

  @ApiModelProperty()
  username: string;

  @ApiModelProperty()
  email: string;
}
