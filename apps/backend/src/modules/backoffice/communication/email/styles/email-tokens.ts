/**
 * Rumbelo email design tokens — mirrors packages/config/tailwind/theme.css.
 * Tuned for WCAG AA contrast on white reading surfaces.
 */

export const emailFonts = {
    display: "'Bricolage Grotesque', Georgia, 'Times New Roman', serif",
    sans: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
} as const;

export const emailRadii = {
    none: '0',
    sm: '6px',
    md: '10px',
    lg: '14px',
} as const;

export const emailLayout = {
    maxWidth: '560px',
    outerPadding: '28px 16px',
    contentInset: '28px',
} as const;

export const emailBrand = {
    /** Deep teal — growth / control */
    accent: '#0f766e',
    accentHover: '#0d9488',
    canvas: '#edeff3',
    canvasDark: '#0b0f16',
    surface: '#ffffff',
    raised: '#f4f6f8',
    ink: '#0e1116',
    inkMuted: '#5a6474',
    inkSecondary: '#3e4859',
    hairline: '#d4d9e2',
    hairlineSubtle: '#e2e6ee',
    button: '#0f766e',
    buttonText: '#ffffff',
} as const;

export const emailShadow = {
    cardLight: '0 8px 24px rgba(14, 17, 22, 0.06)',
    cardDark: '0 8px 24px rgba(0, 0, 0, 0.35)',
} as const;
