import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseBoolPipe implements PipeTransform<string, boolean> {
  transform(value: string, metadata: ArgumentMetadata): boolean {
    if (!value || value === '') {
      return;
    }
    const allowedValues = ['true', 'false'];
    const boolValue = value === 'true';

    if (!allowedValues.includes(value)) {
      throw new BadRequestException('Invalid value');
    }

    return boolValue;
  }
}
