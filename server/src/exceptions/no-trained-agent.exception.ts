import { BadRequestException } from '@nestjs/common';

export class NoTrainedAgentException extends BadRequestException {
  constructor() {
    super('No trained agent');
  }
}
