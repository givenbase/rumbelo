import { type CSSProperties } from 'react';

import { baseStyles } from './base-styles';
import { emailRadii } from './email-tokens';
import { getTheme } from './theme-styles';

export const mergeStyles = (...styles: (CSSProperties | undefined)[]): CSSProperties =>
    styles.reduce<CSSProperties>((merged, style) => (style ? { ...merged, ...style } : merged), {});

export const getButtonStyle = (
    darkMode: boolean,
    size: 'large' | 'medium' | 'small' = 'medium',
    variant: 'outline' | 'primary' | 'secondary' = 'primary'
): CSSProperties => {
    const theme = getTheme(darkMode);

    const sizes = {
        small: { fontSize: '13px', padding: '10px 16px' },
        medium: { fontSize: '15px', padding: '12px 20px' },
        large: { fontSize: '16px', padding: '14px 24px' },
    };

    const variants = {
        primary: {
            backgroundColor: theme.colors.buttonFill,
            color: theme.colors.buttonText,
            border: 'none',
        },
        secondary: {
            backgroundColor: theme.colors.backgroundSecondary,
            color: theme.colors.textPrimary,
            border: `1px solid ${theme.colors.border}`,
        },
        outline: {
            backgroundColor: 'transparent',
            color: theme.colors.textPrimary,
            border: `1px solid ${theme.colors.border}`,
        },
    };

    return mergeStyles(
        {
            borderRadius: emailRadii.sm,
            display: 'inline-block',
            fontFamily: baseStyles.text.fontFamily,
            fontWeight: 600,
            lineHeight: '1.2',
            textAlign: 'center',
            textDecoration: 'none',
        },
        sizes[size],
        variants[variant]
    );
};

export const createEmailStyles = (darkMode = false) => {
    const theme = getTheme(darkMode);

    return {
        heading: mergeStyles(baseStyles.heading, theme.styles.heading),
        subheading: mergeStyles(baseStyles.subheading, theme.styles.subheading),
        text: mergeStyles(baseStyles.text, theme.styles.text),
        noteText: mergeStyles(baseStyles.noteText, theme.styles.noteText),
        smallText: mergeStyles(baseStyles.smallText, theme.styles.smallText),
        section: baseStyles.section,
        container: baseStyles.container,
        colors: theme.colors,
        helpers: { mergeStyles, spacing: baseStyles.spacing },
    };
};
