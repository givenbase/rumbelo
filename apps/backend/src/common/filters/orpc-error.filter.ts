/**
 * Catches ORPCError and returns the correct HTTP status with defined: true.
 * Without this, @orpc/nest often turns contract errors into 500s.
 */

import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { ORPCError } from '@orpc/server';
import { FastifyReply } from 'fastify';

@Catch(ORPCError)
export class OrpcErrorFilter implements ExceptionFilter {
    private readonly logger = new Logger(OrpcErrorFilter.name);

    catch(exception: ORPCError<string, unknown>, host: ArgumentsHost) {
        const reply = host.switchToHttp().getResponse<FastifyReply>();
        const errorWithCause = exception as ORPCError<string, unknown> & {
            cause?: { issues?: unknown[] };
        };

        let validationIssues: unknown[] | undefined;
        if (errorWithCause.cause?.issues && Array.isArray(errorWithCause.cause.issues)) {
            validationIssues = errorWithCause.cause.issues;
        }

        this.logger.debug(`ORPCError: ${exception.code} — ${exception.message}`);

        const statusCode = this.getHttpStatus(exception.code);
        const errorResponse: Record<string, unknown> = {
            defined: true,
            code: exception.code,
            status: statusCode,
            message: exception.message || this.getDefaultMessage(exception.code),
        };

        if (validationIssues?.length) {
            errorResponse.data = {
                ...(exception.data && typeof exception.data === 'object' ? exception.data : {}),
                issues: validationIssues,
            };
        } else if (exception.data) {
            errorResponse.data = exception.data;
        }

        reply.status(statusCode).send(errorResponse);
    }

    private getHttpStatus(code: string): number {
        const statusMap: Record<string, number> = {
            BAD_REQUEST: 400,
            UNAUTHORIZED: 401,
            FORBIDDEN: 403,
            NOT_FOUND: 404,
            METHOD_NOT_SUPPORTED: 405,
            TIMEOUT: 408,
            CONFLICT: 409,
            PRECONDITION_FAILED: 412,
            PAYLOAD_TOO_LARGE: 413,
            UNSUPPORTED_MEDIA_TYPE: 415,
            UNPROCESSABLE_CONTENT: 422,
            TOO_MANY_REQUESTS: 429,
            CLIENT_CLOSED_REQUEST: 499,
            INTERNAL_SERVER_ERROR: 500,
        };
        return statusMap[code] || 500;
    }

    private getDefaultMessage(code: string): string {
        const messageMap: Record<string, string> = {
            BAD_REQUEST: 'Bad Request',
            UNAUTHORIZED: 'Unauthorized',
            FORBIDDEN: 'Forbidden',
            NOT_FOUND: 'Not Found',
            CONFLICT: 'Conflict',
            TOO_MANY_REQUESTS: 'Too Many Requests',
            INTERNAL_SERVER_ERROR: 'Internal Server Error',
        };
        return messageMap[code] || 'Internal Server Error';
    }
}
