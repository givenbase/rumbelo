/** Shell chapter (nav chrome) — future `features.tour.pages.shell.*`. */
const shell = {
    steps: {
        brand: {
            title: 'Home',
            content:
                'Tap the wordmark anytime to return home. Money and Growth live in the portals along the top (or bottom on mobile).',
        },
        period: {
            title: 'Period',
            content:
                'Switch the month you’re looking at. Jar totals and spends follow this period.',
        },
        help: {
            title: 'Help',
            content:
                'Open The Coach for this screen anytime — and replay a short tour if you want.',
        },
    },
} as const;

export default shell;
