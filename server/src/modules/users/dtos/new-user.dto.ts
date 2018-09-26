import { IsIn, IsString, MinLength } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

import { roleList } from '../../../constants';
import { PatchUserDto } from './patch-user.dto';

export class NewUserDto extends PatchUserDto {
  @ApiModelProperty()
  @IsString()
  username: string;

  @ApiModelProperty()
  @IsString()
  @MinLength(8)
  password: string;

  @ApiModelProperty({ enum: roleList })
  @IsIn(roleList)
  role: string;
}
