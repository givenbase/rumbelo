import type { StatusType } from './types';

export const STATUS_COPY: Record<StatusType, { code: number; title: string; description: string }> =
    {
        error: {
            code: 500,
            title: 'Something went wrong',
            description:
                'We hit an unexpected problem loading this page. Try again — if it keeps happening, come back in a moment.',
        },
        'not-found': {
            code: 404,
            title: 'This page does not exist',
            description:
                'It may have moved, or the link may be wrong. Head back and pick up where you left off.',
        },
        'access-denied': {
            code: 403,
            title: 'You cannot open this',
            description: 'Your account does not have access to this part of Rumbelo.',
        },
        unauthorized: {
            code: 401,
            title: 'Sign in to continue',
            description:
                'Your session ended or you are not signed in. Sign in again to pick up where you left off.',
        },
        maintenance: {
            code: 503,
            title: 'Rumbelo is briefly offline',
            description:
                'We are doing a short update. Your jars and data are safe — try again in a few minutes.',
        },
        offline: {
            code: 0,
            title: 'You appear to be offline',
            description:
                'Check your connection, then try again. Nothing here works without the network.',
        },
    };
