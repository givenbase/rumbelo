import { applyDecorators, Controller, HttpStatus } from '@nestjs/common';
import { ApiCookieAuth, ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger';

export type ApiSchema = 'auth' | 'backoffice' | 'public';

export class SwaggerErrorResponse {
    @ApiProperty({ example: 500, type: Number })
    statusCode?: number;

    @ApiProperty({ example: 'Internal server error', type: String })
    message?: string;

    @ApiProperty({ example: 'Error', type: String })
    error?: string;
}

export const ApiCommonResponses = () =>
    applyDecorators(
        ApiResponse({
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            description: 'Server Error',
            type: () => SwaggerErrorResponse,
        }),
        ApiResponse({
            status: HttpStatus.BAD_REQUEST,
            description: 'Bad Request',
            type: () => SwaggerErrorResponse,
        }),
        ApiResponse({
            status: HttpStatus.UNAUTHORIZED,
            description: 'Unauthorized',
            type: () => SwaggerErrorResponse,
        }),
        ApiResponse({
            status: HttpStatus.FORBIDDEN,
            description: 'Forbidden',
            type: () => SwaggerErrorResponse,
        })
    );

/**
 * oRPC controller + Swagger tags.
 * Uses bare `@Controller()` so Nest discovers the class; routes come from contracts.
 */
export function ControllerSwagger(path: string, schema: ApiSchema = 'public', customTag?: string) {
    const fullPath = `${schema}/${path}`;
    const displayTag =
        customTag ||
        fullPath
            .replace(/[/-]/g, ' ')
            .split(' ')
            .map(w => w.charAt(0).toUpperCase() + w.slice(1))
            .join(' ');

    return applyDecorators(
        Controller(),
        ApiTags(displayTag),
        ApiCookieAuth('session'),
        ApiCommonResponses()
    );
}
