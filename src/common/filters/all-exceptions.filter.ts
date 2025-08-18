import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { AppErrorCodes } from '../errors/app-error-codes';

// TypeORM / MySQL
import { QueryFailedError, EntityNotFoundError } from 'typeorm';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    const request = ctx.getRequest<Request>() as any;
    const method = request?.method;
    const path = request?.url;

    // Mặc định
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Internal server error';
    let error = 'Internal Server Error';
    let code: string | null = AppErrorCodes.INTERNAL_ERROR;
    let details: any = null;

    // 1) HttpException của Nest (BadRequestException, NotFoundException,...)
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();

      // res có thể là string hoặc object { message, error, statusCode }
      if (typeof res === 'string') {
        message = res;
      } else if (typeof res === 'object' && res) {
        const r: any = res;
        message = r.message ?? message;
        error = r.error ?? error;
        details = r.details ?? null;

        // Nếu là lỗi validate của ValidationPipe
        // Nest thường trả { statusCode, message: string[], error: 'Bad Request' }
        if (Array.isArray(r.message)) {
          code = AppErrorCodes.VALIDATION_FAILED;
          error = r.error || 'Validation Error';
        }
      }

      // Giữ code nếu HttpException có 'code' tuỳ biến
      // @ts-ignore
      if (
        (exception as any).code &&
        typeof (exception as any).code === 'string'
      ) {
        // @ts-ignore
        code = (exception as any).code;
      }
    }

    // 2) Lỗi TypeORM: truy vấn/constraint/duplicate
    else if (exception instanceof QueryFailedError) {
      status = HttpStatus.CONFLICT;
      error = 'Database Error';

      // @ts-ignore
      const driverErr = exception.driverError || {};
      // MySQL duplicate
      // ER_DUP_ENTRY = 1062
      if (driverErr.code === 'ER_DUP_ENTRY' || driverErr.errno === 1062) {
        message = 'Duplicate entry';
        code = AppErrorCodes.DUPLICATE_ENTRY;
        details = { sqlMessage: driverErr.sqlMessage };
      } else {
        status = HttpStatus.BAD_REQUEST;
        message = driverErr.sqlMessage || 'Query failed';
        code = AppErrorCodes.DB_CONSTRAINT;
        details = { errno: driverErr.errno, code: driverErr.code };
      }
    }

    // 3) Lỗi không tìm thấy entity (nếu bạn dùng Repository.findOneOrFail)
    else if (exception instanceof EntityNotFoundError) {
      status = HttpStatus.NOT_FOUND;
      error = 'Not Found';
      message = 'Entity not found';
      code = AppErrorCodes.ENTITY_NOT_FOUND;
      details = { where: (exception as any).message };
    }

    // 4) Lỗi lạ (Error thường)
    else if (exception instanceof Error) {
      // Có thể phân nhánh theo tên lỗi tuỳ ý
      message = exception.message || message;
      error = exception.name || error;
      // giữ INTERNAL_SERVER_ERROR
    }

    // Log server-side (đủ để debug)
    this.logger.error(
      `[${method} ${path}] ${error} (${status}) - ${typeof message === 'string' ? message : JSON.stringify(message)}`,
      (exception as any)?.stack,
    );

    const responseBody = {
      success: false,
      timestamp: new Date().toISOString(),
      path,
      method,
      statusCode: status,
      error,
      message,
      code,
      details,
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, status);
  }
}
