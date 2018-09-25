import { ApiModelProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiModelProperty({
    example: 'ericzon'
  })
  username: string;

  @ApiModelProperty({
    example: 'test1235'
  })
  password: string;
}
