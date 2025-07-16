import { BaseException } from '@/config/exceptions/base.exception';

export class NotFoundException extends BaseException {
  constructor(message: string = 'Recurso no encontrado') {
    super(message, 404, 'NOT_FOUND');
  }
} 