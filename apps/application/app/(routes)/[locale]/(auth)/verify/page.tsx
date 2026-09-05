import { redirect } from 'next/navigation';

import { env } from '@/app/_utils/get-env';

function webAuthUrl(path: string, search = ''): string {
    const base = env.NEXT_PUBLIC_DOMAIN_WEB.replace(/\/$/, '');
    return `${base}${path}${search}`;
}

/** Email verification lives on the marketing site. */
export default async function VerifyRedirectPage({
    searchParams,
}: {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
    const params = await searchParams;
    const qs = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
        if (typeof value === 'string') qs.set(key, value);
    }
    const search = qs.toString() ? `?${qs.toString()}` : '';
    redirect(webAuthUrl('/verify', search));
}
