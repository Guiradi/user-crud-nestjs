import { HttpException, HttpStatus } from '@nestjs/common';

export class ForbiddenException extends HttpException {
  constructor() {
    super(
      'Your user is not allowed to access this content.',
      HttpStatus.FORBIDDEN,
    );
  }
}
