/**
 * Rumtelo email design tokens — mirrors packages/config/tailwind/theme.css.
 * Tuned for WCAG AA contrast on white reading surfaces.
 * Brand book: teal #06656C · navy #1A202D · Archivo / Archivo Narrow.
 */

export const emailFonts = {
    display: "'Archivo Narrow', 'Arial Narrow', Arial, sans-serif",
    sans: "'Archivo', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
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
    /** Brand teal #06656C */
    accent: '#06656c',
    accentHover: '#00777f',
    canvas: '#eef1f5',
    canvasDark: '#1a202d',
    surface: '#ffffff',
    raised: '#e8ecf2',
    ink: '#1a202d',
    inkMuted: '#5a6474',
    inkSecondary: '#3e4859',
    hairline: '#d4d9e2',
    hairlineSubtle: '#e2e6ee',
    button: '#06656c',
    buttonText: '#ffffff',
} as const;

export const emailShadow = {
    cardLight: '0 8px 24px rgba(14, 17, 22, 0.06)',
    cardDark: '0 8px 24px rgba(0, 0, 0, 0.35)',
} as const;
