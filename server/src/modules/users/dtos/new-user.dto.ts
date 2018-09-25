import { ApiModelProperty } from '@nestjs/swagger';

import { roleList } from '../../../constants';

export class NewUserDto {
  @ApiModelProperty()
  name: string;

  @ApiModelProperty()
  username: string;

  @ApiModelProperty()
  password: string;

  @ApiModelProperty()
  email: string;

  @ApiModelProperty({ enum: roleList })
  role: string;
}
