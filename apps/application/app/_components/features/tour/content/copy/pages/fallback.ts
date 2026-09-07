/** Fallback help when no route match — future `features.tour.pages.fallback.*`. */
const fallback = {
    title: 'This screen',
    sections: {
        looking_at: {
            heading: 'What you’re looking at',
            body: 'This page is part of your household money and growth setup. Use Period (top right) to switch months. Numbers follow the jars split you set in Settings.',
        },
    },
} as const;

export default fallback;
