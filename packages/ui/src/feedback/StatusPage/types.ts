export type StatusType =
    | 'access-denied'
    | 'error'
    | 'maintenance'
    | 'not-found'
    | 'offline'
    | 'unauthorized';

export interface StatusPageProps {
    /** Shown in development when type is `error`. */
    errorDetails?: string;
    /** Primary home / escape link. Defaults to `/`. */
    homeHref?: string;
    /** Label for the home link. */
    homeLabel?: string;
    /** Retry handler — typically `reset` from Next.js `error.tsx`. */
    reset?: () => void;
    /** Override auto status code. Pass `0` / falsy to hide. */
    statusCode?: number | string | null;
    type: StatusType;
    /** Optional copy overrides. */
    title?: string;
    description?: string;
}
