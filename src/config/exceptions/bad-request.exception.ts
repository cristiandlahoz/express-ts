import { BaseException } from '@/config/exceptions/base.exception';

export class BadRequestException extends BaseException {
  constructor(message: string = 'Solicitud inválida') {
    super(message, 400, 'BAD_REQUEST');
  }
} 