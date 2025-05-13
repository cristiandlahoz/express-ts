import { BaseException } from './base.exception';

export class UnauthorizedException extends BaseException {
  constructor(message: string = 'No autorizado') {
    super(message, 401, 'UNAUTHORIZED');
  }
} 