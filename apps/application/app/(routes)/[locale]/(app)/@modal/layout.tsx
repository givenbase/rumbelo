/**
 * Soft-nav create/update modals must not be statically prerendered — Next 16.3
 * cannot resolve `[locale]` for `(...)` intercept slots during SSG.
 */
export const dynamic = 'force-dynamic';

export default function ModalSlotLayout({ children }: { children: React.ReactNode }) {
    return children;
}
