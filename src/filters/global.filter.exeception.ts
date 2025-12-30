import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { PrismaClientInitializationError } from '@prisma/client/runtime/library';
import { Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();

    if (exception instanceof PrismaClientInitializationError) {
      return response
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'Erro na base de dados' });
    }

    if (exception instanceof HttpException) {
      const exceptionError = exception.getResponse();
      if (Array.isArray(exceptionError['message'])) {
        return response
          .status(exception.getStatus())
          .json({ message: exceptionError['message'][0] });
      } else {
        return response
          .status(exception.getStatus())

          .json({ message: exceptionError['message'] });
      }
    }

    console.log(exception);
    return response
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: 'Erro interno de servidor' });
  }
}
