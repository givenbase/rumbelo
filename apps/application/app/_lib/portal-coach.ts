import type { PortalHubProps } from '@/components/features/home/portal-hub';

export function pickPortalCoach(
    messages: Array<{
        kind: string;
        text: string;
        ctaLabel: string | null;
        ctaHref: string | null;
    }>,
    fallback: PortalHubProps['coach']
): PortalHubProps['coach'] {
    const tip = messages[0];
    if (!tip) return fallback;
    return {
        dot: fallback.dot,
        kind: tip.kind.replaceAll('_', ' '),
        text: tip.text,
        cta: tip.ctaLabel ?? fallback.cta,
        href: tip.ctaHref ?? fallback.href,
    };
}
