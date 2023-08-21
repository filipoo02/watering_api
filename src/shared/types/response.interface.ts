import { HttpStatus } from '@nestjs/common';

export interface ResponseInterface<T = any> {
  statusCode: HttpStatus;
  message: string;
  data: T;
}
