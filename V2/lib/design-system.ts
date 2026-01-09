/**
 * NyayaFlow Design System
 * Centralized typography and design tokens
 */

export const typography = {
    fontFamily: {
        primary: '"Overused Grotesk", sans-serif',
    },

    fontWeight: {
        light: 300,
        regular: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
        extrabold: 800,
        black: 900,
    },

    fontSize: {
        xs: '0.75rem',      // 12px
        sm: '0.875rem',     // 14px
        base: '1rem',       // 16px
        lg: '1.125rem',     // 18px
        xl: '1.25rem',      // 20px
        '2xl': '1.5rem',    // 24px
        '3xl': '1.875rem',  // 30px
        '4xl': '2.25rem',   // 36px
        '5xl': '3rem',      // 48px
    },

    lineHeight: {
        tight: 1.2,
        normal: 1.5,
        relaxed: 1.75,
    },
} as const;

export const fontClasses = {
    // Headings - Bold weights
    heading: 'font-bold tracking-tight',
    display: 'font-bold tracking-tight',

    // Body text - Regular weights
    body: 'font-normal leading-relaxed',

    // Technical/Code - Light weights
    mono: 'font-light tracking-wide',

    // Legal documents - Medium weights
    legal: 'font-medium leading-relaxed',
} as const;

export type FontWeight = keyof typeof typography.fontWeight;
export type FontSize = keyof typeof typography.fontSize;
