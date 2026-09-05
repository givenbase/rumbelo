/**
 * Root layout (no locale).
 *
 * Required by the App Router for routes outside `[locale]`.
 * Real chrome lives in `app/(routes)/[locale]/layout.tsx` (Galighticus pattern).
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
    return children;
}
