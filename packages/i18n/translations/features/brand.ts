/**
 * Brand voice — source of truth for taglines and auth panels.
 * Keep in sync with docs/brand when that doc exists.
 * Currency-agnostic — never lock lines to euro/dollar symbols.
 */
const brand = {
    tagline: 'Stop wondering where it went.',
    core: {
        one: 'Stop wondering where it went.',
        two: 'Money leaves. You’ll know why.',
        three: 'No more mystery spending.',
    },
    auth_quotes: {
        money_picture: {
            eyebrow: 'The money picture',
            headline: 'Stop wondering where it went.',
            support: 'Money leaves. You’ll know why. No more mystery spending.',
        },
        how_it_works: {
            eyebrow: 'How it works',
            headline: 'Split first. Spend second.',
            support:
                'Income lands and gets a job across six jars before you touch it. Paycheck in. Picture clear.',
        },
        who_its_for: {
            eyebrow: 'Who it’s for',
            headline: 'Built for people who are doing well — and for people who are ready to.',
            support:
                'Don’t chase the number. Own the direction. Ambition with a map — not a guess.',
        },
        bigger_than_balance: {
            eyebrow: 'Bigger than the balance',
            headline: 'Assign the money. Protect the energy. Keep the why.',
            support:
                'Money, growth, energy, and soul — one calm overview. A tired head spends; a rested head decides.',
        },
    },
} as const;

export default brand;
