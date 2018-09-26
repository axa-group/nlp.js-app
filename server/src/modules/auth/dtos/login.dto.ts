import { IsString } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiModelProperty({ example: 'ericzon' })
  @IsString()
  username: string;

  @ApiModelProperty({ example: 'test1235' })
  @IsString()
  password: string;
}
