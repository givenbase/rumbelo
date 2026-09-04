import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

/**
 * Lightweight Swagger metadata for an `@Implement` handler.
 * Full Zod→JSON Schema extraction can grow later; this keeps tags + summaries useful.
 */
export function SwaggerOrpc(options: {
    summary: string;
    description?: string;
    successStatus?: number;
}) {
    return applyDecorators(
        ApiOperation({
            summary: options.summary,
            description: options.description,
        }),
        ApiResponse({
            status: options.successStatus ?? 200,
            description: 'Success',
        })
    );
}
