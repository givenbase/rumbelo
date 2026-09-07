/** Help sheet chrome + Joyride button labels — future `features.tour.chrome.*`. */
const chrome = {
    help_trigger: 'Help',
    sheet_description: 'What this is for · how it works',
    take_tour_prompt: 'Want a quick walkthrough of this screen?',
    replay_tour_prompt: 'Replay the walkthrough for this screen?',
    take_tour: 'Take a tour',
    replay_tour: 'Replay tour',
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
