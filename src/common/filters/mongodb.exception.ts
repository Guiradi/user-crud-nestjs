import {
  BadRequestException,
  Catch,
  ConflictException,
  ExceptionFilter,
} from '@nestjs/common';
import { MongoError } from 'mongodb';

@Catch(MongoError)
export class MongoExceptionFilter implements ExceptionFilter {
  catch(exception: MongoError) {
    switch (exception.code) {
      case 11000:
        throw new ConflictException('User already exists.');
      default:
        throw new BadRequestException('Error while processing database action');
    }
  }
}
