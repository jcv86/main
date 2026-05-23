/**
 * Pillar color scheme from brandbook
 * Used for Cards and UI elements across A1-A4 pillars
 */

export const PILLAR_COLORS = {
  A1: {
    name: 'A1 - Identidad Profesional',
    primary: 'rgb(80, 160, 170)', // Teal
    primaryRgba: 'rgba(80, 160, 170, 0.15)',
    accent: 'rgb(80, 160, 170)',
    accentRgba: 'rgba(80, 160, 170, 0.3)',
  },
  A2: {
    name: 'A2 - Inventario y Valor',
    primary: 'rgb(90, 90, 150)', // Purple
    primaryRgba: 'rgba(90, 90, 150, 0.15)',
    accent: 'rgb(90, 90, 150)',
    accentRgba: 'rgba(90, 90, 150, 0.3)',
  },
  A3: {
    name: 'A3 - Entrenamiento',
    primary: 'rgb(170, 70, 170)', // Magenta
    primaryRgba: 'rgba(170, 70, 170, 0.15)',
    accent: 'rgb(170, 70, 170)',
    accentRgba: 'rgba(170, 70, 170, 0.3)',
  },
  A4: {
    name: 'A4 - Ejecución Continua',
    primary: 'rgb(225, 120, 130)', // Rose
    primaryRgba: 'rgba(225, 120, 130, 0.15)',
    accent: 'rgb(225, 120, 130)',
    accentRgba: 'rgba(225, 120, 130, 0.3)',
  },
} as const

export const TEAL_ACCENT = 'rgb(80, 160, 170)'
export const TEAL_ACCENT_LIGHT = 'rgba(80, 160, 170, 0.2)'
export const TEAL_ACCENT_LIGHTER = 'rgba(80, 160, 170, 0.1)'

// Helper functions for card styling
export const getPillarCardClass = (pillarKey: keyof typeof PILLAR_COLORS) => {
  return `bg-[${PILLAR_COLORS[pillarKey].primaryRgba}] shadow-lg border-0`
}

export const getPillarCardStyle = (pillarKey: keyof typeof PILLAR_COLORS) => {
  return {
    backgroundColor: PILLAR_COLORS[pillarKey].primaryRgba,
  }
}

export const getPillarIconColor = (pillarKey: keyof typeof PILLAR_COLORS) => {
  return PILLAR_COLORS[pillarKey].primary
}
