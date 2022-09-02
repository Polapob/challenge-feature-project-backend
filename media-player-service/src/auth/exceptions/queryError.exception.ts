import { BadRequestException } from '@nestjs/common';

export class QueryErrorException extends BadRequestException {
  constructor() {
    super('State or code is undefined!');
  }
}
