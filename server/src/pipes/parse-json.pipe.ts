import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseJsonPipe implements PipeTransform<string, object> {
  transform(value: string, metadata: ArgumentMetadata): object {
    if (!value || value === '') {
      return;
    }

    try{
      return typeof value === 'object' || JSON.parse(value);
    } catch (e) {
      throw new BadRequestException('Invalid json');
    }
  }
}
