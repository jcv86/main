// DTC Brand Design Tokens
// Base colors matching the premium black-first aesthetic

export const dtcColors = {
  // Core neutrals (70-80% of palette)
  black: '#000000',
  foreground: '#F5F5F2',
  muted: '#B8B8B2',
  card: '#050505',
  border: 'rgba(255, 255, 255, 0.10)',
  borderLight: 'rgba(255, 255, 255, 0.16)',
  
  // Brand accent colors (15-20% dominant, 5-10% support)
  yellow: '#E4BF37',  // Ritual phase
  orange: '#F47C48',  // Exploración phase
  red: '#E33D4B',     // Entrenamiento phase
  green: '#2FB773',   // Support accent
  purple: '#9B59B6',  // Support accent
  blue: '#4B50C7',    // Realidad phase
  
  // Phase mapping (locked)
  phases: {
    ritual: '#E4BF37',
    exploración: '#F47C48',
    entrenamiento: '#E33D4B',
    realidad: '#4B50C7',
  }
} as const

export const dtcTypography = {
  // Display - Laro Soft
  h1: {
    desktop: { fontSize: '88px', lineHeight: 0.95, letterSpacing: '-0.04em', fontWeight: 700 },
    mobile: { fontSize: '48px', lineHeight: 0.95, letterSpacing: '-0.04em', fontWeight: 700 },
  },
  h2: {
    desktop: { fontSize: '56px', lineHeight: 0.98, letterSpacing: '-0.03em', fontWeight: 700 },
    mobile: { fontSize: '32px', lineHeight: 0.98, letterSpacing: '-0.03em', fontWeight: 700 },
  },
  h3: {
    desktop: { fontSize: '24px', lineHeight: 1.1, fontWeight: 600 },
    mobile: { fontSize: '20px', lineHeight: 1.1, fontWeight: 600 },
  },
  // Body - Montserrat
  body: {
    fontSize: '16px',
    lineHeight: 1.75,
    fontWeight: 400,
  },
  label: {
    fontSize: '11px',
    textTransform: 'uppercase',
    letterSpacing: '0.24em',
    fontWeight: 600,
  }
} as const

export const dtcSpacing = {
  section: {
    desktop: '96px',
    mobile: '48px',
  },
  grid: '24px',
} as const

export const dtcRadius = {
  lg: '20px',   // XL
  xl: '28px',   // 2XL
  '2xl': '36px', // 3XL
  pill: '999px',
} as const

export const dtcShadows = {
  soft: '0 10px 30px rgba(0, 0, 0, 0.35)',
  elevated: '0 18px 48px rgba(0, 0, 0, 0.42)',
} as const
