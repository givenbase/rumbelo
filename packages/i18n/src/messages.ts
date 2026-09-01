/** Message catalog — keys mirror design `data-en` pairs. */
export const messages = {
    nl: {
        shell: {
            tagline: 'Geld met intentie',
            settings: 'Instellingen',
            period: 'Periode',
            signIn: 'Inloggen',
            signUp: 'Account aanmaken',
        },
        onboarding: {
            welcome: 'Welkom bij Rumbelo',
            income: 'Jouw inkomen',
            jars: 'De zes potten',
            why: 'Jouw waarom',
        },
        dashboard: {
            closeTurn: 'Beurt afsluiten',
            closing: 'Bezig…',
            turnClosed: 'Maand afgesloten',
            closeFailed: 'Afsluiten mislukt',
        },
    },
    en: {
        shell: {
            tagline: 'Money with intention',
            settings: 'Settings',
            period: 'Period',
            signIn: 'Sign in',
            signUp: 'Create account',
        },
        onboarding: {
            welcome: 'Welcome to Rumbelo',
            income: 'Your income',
            jars: 'The six jars',
            why: 'Your why',
        },
        dashboard: {
            closeTurn: 'Close turn',
            closing: 'Closing…',
            turnClosed: 'Month closed',
            closeFailed: 'Could not close turn',
        },
    },
} as const;

export type MessageLocale = keyof typeof messages;
