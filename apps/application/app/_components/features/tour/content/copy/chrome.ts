/** Help sheet chrome + Joyride button labels — future `features.tour.chrome.*`. */
const chrome = {
    help_trigger: 'Help',
    sheet_eyebrow: 'Feature help',
    sheet_description: 'A short brief for this screen',
    take_tour_prompt: 'Want a quick walkthrough of this screen?',
    replay_tour_prompt: 'Replay the walkthrough for this screen?',
    take_tour: 'Take a tour',
    replay_tour: 'Replay tour',
    no_tour: 'No guided tour on this screen yet — the brief above covers the basics.',
    helpers_label: 'Show The Coach on screens',
    helpers_hint:
        'Why-lines and jar cards from The Coach (✦ The Coach). Same as Settings → Account. On by default for beginners.',
    helpers_on: 'On',
    helpers_off: 'Off',
    settings: {
        eyebrow: 'Guided tour',
        blurb: 'Walk through nav, jars, fixed costs, and income again anytime.',
        row_title: 'Product tour',
        row_sub: 'Same walkthrough as after setup',
        restart: 'Start full tour',
    },
    joyride: {
        back: 'Back',
        close: 'Close',
        last: 'Done',
        next: 'Next',
        skip: 'Skip',
    },
} as const;

export default chrome;
