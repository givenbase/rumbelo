import { type CSSProperties } from 'react';

import { emailBrand, emailFonts } from './email-tokens';

export interface EmailThemeColors {
    background: string;
    backgroundSecondary: string;
    border: string;
    buttonFill: string;
    buttonText: string;
    divider: string;
    textMuted: string;
    textPrimary: string;
    textSecondary: string;
}

export interface EmailTheme {
    colors: EmailThemeColors;
    styles: {
        button: CSSProperties;
        heading: CSSProperties;
        noteText: CSSProperties;
        smallText: CSSProperties;
        subheading: CSSProperties;
        text: CSSProperties;
    };
}

export const lightTheme: EmailTheme = {
    colors: {
        textPrimary: emailBrand.ink,
        textSecondary: emailBrand.inkSecondary,
        textMuted: emailBrand.inkMuted,
        background: emailBrand.surface,
        backgroundSecondary: emailBrand.raised,
        border: emailBrand.hairline,
        divider: emailBrand.hairlineSubtle,
        buttonFill: emailBrand.button,
        buttonText: emailBrand.buttonText,
    },
    styles: {
        heading: {
            color: emailBrand.ink,
            fontFamily: emailFonts.display,
            fontWeight: 600,
        },
        subheading: {
            color: emailBrand.accent,
            fontFamily: emailFonts.sans,
            fontWeight: 600,
            fontSize: '11px',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
        },
        text: { color: emailBrand.ink },
        noteText: { color: emailBrand.inkMuted },
        smallText: { color: emailBrand.inkMuted },
        button: {
            backgroundColor: emailBrand.button,
            color: emailBrand.buttonText,
            border: 'none',
        },
    },
};

export const darkTheme: EmailTheme = {
    colors: {
        textPrimary: '#f2f5f9',
        textSecondary: '#a7b2c3',
        textMuted: '#93a0b2',
        background: '#141a24',
        backgroundSecondary: '#1b2331',
        border: 'rgba(255,255,255,0.12)',
        divider: 'rgba(255,255,255,0.09)',
        buttonFill: '#2dd4bf',
        buttonText: '#0b0f16',
    },
    styles: {
        heading: {
            color: '#f2f5f9',
            fontFamily: emailFonts.display,
            fontWeight: 600,
        },
        subheading: {
            color: '#5eead4',
            fontFamily: emailFonts.sans,
            fontWeight: 600,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
        },
        text: { color: '#f2f5f9' },
        noteText: { color: '#93a0b2' },
        smallText: { color: '#93a0b2' },
        button: {
            backgroundColor: '#2dd4bf',
            color: '#0b0f16',
            border: 'none',
        },
    },
};

export const getTheme = (darkMode = false): EmailTheme => (darkMode ? darkTheme : lightTheme);
