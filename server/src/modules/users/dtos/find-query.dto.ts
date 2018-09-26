import { IsJSON, IsOptional } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class FindQueryDto {
  @ApiModelProperty({ type: Object, required: false })
  @IsJSON()
  @IsOptional()
  where: object;
}
