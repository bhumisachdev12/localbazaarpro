// Dark Lavender Theme - Elegant & Modern
export const COLORS = {
    // Primary colors - Lavender to Purple Gradient
    primary: '#A78BFA',        // Soft lavender
    primaryDark: '#8B5CF6',    // Deep purple
    primaryLight: '#C4B5FD',   // Light lavender
    primaryLighter: '#DDD6FE', // Very light lavender

    // Secondary colors - Purple accent
    secondary: '#9333EA',      // Vibrant purple
    secondaryDark: '#7C3AED',  // Deep purple
    secondaryLight: '#A855F7', // Light purple

    // Accent colors - Pink/Rose
    accent: '#EC4899',         // Hot pink
    accentDark: '#DB2777',     // Deep pink
    accentLight: '#F472B6',    // Light pink

    // Orange accent for highlights
    orange: '#FB923C',
    orangeLight: '#FDBA74',
    orangeDark: '#F97316',

    // Neutral colors - Dark theme
    white: '#FFFFFF',
    black: '#000000',
    gray50: '#18181B',         // Almost black
    gray100: '#27272A',        // Very dark gray
    gray200: '#3F3F46',        // Dark gray
    gray300: '#52525B',        // Medium dark gray
    gray400: '#71717A',        // Medium gray
    gray500: '#A1A1AA',        // Light gray
    gray600: '#D4D4D8',        // Very light gray
    gray700: '#E4E4E7',        // Almost white
    gray800: '#F4F4F5',        // Off white
    gray900: '#FAFAFA',        // Near white

    // Status colors - Vibrant on dark
    success: '#10B981',        // Emerald
    successLight: '#34D399',
    successDark: '#059669',
    error: '#EF4444',          // Red
    errorLight: '#F87171',
    errorDark: '#DC2626',
    warning: '#F59E0B',        // Amber
    warningLight: '#FBBF24',
    warningDark: '#D97706',
    info: '#3B82F6',           // Blue
    infoLight: '#60A5FA',
    infoDark: '#2563EB',

    // Background colors - Dark theme
    background: '#000000',           // Pure black
    backgroundSecondary: '#0A0A0A',  // Near black
    backgroundTertiary: '#18181B',   // Dark gray
    backgroundDark: '#000000',

    // Text colors - Light on dark
    textPrimary: '#FFFFFF',
    textSecondary: '#D4D4D8',
    textTertiary: '#A1A1AA',
    textLight: '#71717A',
    textWhite: '#FFFFFF',
    textMuted: '#52525B',

    // Border colors - Subtle on dark
    border: '#27272A',
    borderDark: '#3F3F46',
    borderLight: '#18181B',

    // Card colors - Dark cards
    card: '#18181B',
    cardHover: '#27272A',

    // Overlay colors
    overlay: 'rgba(0, 0, 0, 0.8)',
    overlayLight: 'rgba(0, 0, 0, 0.6)',
    overlayDark: 'rgba(0, 0, 0, 0.9)',

    // Gradient overlays
    gradientOverlay: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.9) 100%)',
};

export const GRADIENTS = {
    // Primary gradients - Lavender to Purple
    primary: ['#A78BFA', '#8B5CF6'],           // Lavender to Purple
    primaryVertical: ['#A78BFA', '#C4B5FD'],   // Lavender gradient
    primarySubtle: ['#DDD6FE', '#E9D5FF'],     // Light lavender

    // Secondary gradients - Purple
    secondary: ['#9333EA', '#A855F7'],         // Purple gradient

    // Accent gradients - Pink
    accent: ['#EC4899', '#F472B6'],            // Pink gradient
    sunset: ['#FB923C', '#EC4899'],            // Orange to Pink
    ocean: ['#A78BFA', '#3B82F6'],             // Lavender to Blue
    warm: ['#F59E0B', '#FB923C'],              // Amber to Orange

    // Status gradients
    success: ['#10B981', '#34D399'],
    error: ['#EF4444', '#F87171'],

    // Background gradients - Dark theme
    background: ['#000000', '#0A0A0A'],
    card: ['#18181B', '#27272A'],
    dark: ['#000000', '#18181B'],
} as const;

export const SPACING = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    xxxl: 64,
    xxxxl: 80,
};

export const FONT_SIZES = {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    xxxxl: 40,
    hero: 48,
};

export const FONT_WEIGHTS = {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
};

export const BORDER_RADIUS = {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    full: 9999,
};

export const SHADOWS = {
    none: {
        shadowColor: 'transparent',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0,
        shadowRadius: 0,
        elevation: 0,
    },
    xs: {
        shadowColor: '#A78BFA',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.15,
        shadowRadius: 2,
        elevation: 1,
    },
    sm: {
        shadowColor: '#A78BFA',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 2,
    },
    md: {
        shadowColor: '#A78BFA',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 4,
    },
    lg: {
        shadowColor: '#A78BFA',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 8,
    },
    xl: {
        shadowColor: '#A78BFA',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.35,
        shadowRadius: 24,
        elevation: 12,
    },
    xxl: {
        shadowColor: '#A78BFA',
        shadowOffset: { width: 0, height: 16 },
        shadowOpacity: 0.4,
        shadowRadius: 32,
        elevation: 16,
    },
};

// Elevation system for consistent depth
export const ELEVATION = {
    level0: SHADOWS.none,
    level1: SHADOWS.xs,
    level2: SHADOWS.sm,
    level3: SHADOWS.md,
    level4: SHADOWS.lg,
    level5: SHADOWS.xl,
    level6: SHADOWS.xxl,
};

// Opacity values
export const OPACITY = {
    disabled: 0.4,
    hover: 0.8,
    pressed: 0.6,
    overlay: 0.5,
    subtle: 0.1,
};

// Animation durations (in milliseconds)
export const ANIMATION = {
    fastest: 100,
    fast: 150,
    normal: 300,
    slow: 500,
    slowest: 800,
};

// Z-index layers
export const Z_INDEX = {
    base: 0,
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
};
