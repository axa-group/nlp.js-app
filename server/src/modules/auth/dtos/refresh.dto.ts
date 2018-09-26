import { IsString } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class RefreshDto {
  @ApiModelProperty()
  @IsString()
  refresh_token: string;
}
