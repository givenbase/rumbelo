/**
 * Mark Errors Defined Plugin
 *
 * Workaround for @orpc/nest: contract error definitions are not transferred to
 * runtime procedures, so ORPCErrors serialize as defined:false → HTTP 500.
 */

import { ORPCError } from '@orpc/server';

import { mapToOrpcClientError } from '../utils/database-constraint-error.util';

export class MarkErrorsDefinedPlugin {
    name = 'mark-errors-defined';

    async onError(params: { error: unknown; meta: unknown }) {
        params.error = mapToOrpcClientError(params.error);

        if (params.error instanceof ORPCError) {
            const originalToJSON = params.error.toJSON?.bind(params.error);
            if (originalToJSON) {
                params.error.toJSON = () => {
                    const json = originalToJSON();
                    return { ...json, defined: true };
                };
            }
        }

        return params.error;
    }
}
