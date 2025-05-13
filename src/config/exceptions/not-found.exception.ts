import { BaseException } from './base.exception';

export class NotFoundException extends BaseException {
  constructor(message: string = 'Recurso no encontrado') {
    super(message, 404, 'NOT_FOUND');
  }
} 