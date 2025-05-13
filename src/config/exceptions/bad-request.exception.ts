import { BaseException } from './base.exception';

export class BadRequestException extends BaseException {
  constructor(message: string = 'Solicitud inválida') {
    super(message, 400, 'BAD_REQUEST');
  }
} 