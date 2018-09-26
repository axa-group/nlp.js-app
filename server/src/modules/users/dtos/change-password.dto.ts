import { IsString, MinLength } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiModelProperty()
  @IsString()
  @MinLength(8)
  password: string;
}
