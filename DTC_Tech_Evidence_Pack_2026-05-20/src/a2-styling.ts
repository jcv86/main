// Premium Dark A2 Color Palette & Styling Guide

export const A2_COLORS = {
  // Primary Brand Color
  primary: 'rgb(90, 90, 150)',
  primaryLight: 'rgba(90, 90, 150, 0.1)',
  primaryMuted: 'rgba(90, 90, 150, 0.2)',
  primaryDim: 'rgba(90, 90, 150, 0.05)',

  // Success/Accent - Teal
  success: 'rgb(80, 160, 170)',
  successLight: 'rgba(80, 160, 170, 0.1)',
  successMuted: 'rgba(80, 160, 170, 0.2)',

  // Alert/Error - Red
  alert: 'rgb(239, 68, 68)',
  alertLight: 'rgba(239, 68, 68, 0.1)',
  alertMuted: 'rgba(239, 68, 68, 0.2)',

  // Background
  bg: '#1a1a2e',
  bgDarker: '#0f0f1e',

  // Text
  text: '#ffffff',
  textMuted: 'rgba(255, 255, 255, 0.7)',
  textDim: 'rgba(255, 255, 255, 0.5)',
  textLight: 'rgba(255, 255, 255, 0.3)',

  // Surfaces
  cardBg: 'rgba(90, 90, 150, 0.1)',
  cardBorder: 'rgba(90, 90, 150, 0.2)',
  inputBg: 'rgba(15, 15, 30, 0.5)',
  inputBorder: 'rgba(90, 90, 150, 0.2)',
}

export const A2_SPACING = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  xxl: '32px',
}

export const A2_BORDER_RADIUS = {
  sm: '8px',
  md: '12px',
  lg: '16px',
  full: '9999px',
}

// Consistent component styling functions
export const cardStyle = (highlighted = false) => ({
  backgroundColor: highlighted ? A2_COLORS.primaryLight : A2_COLORS.cardBg,
  borderColor: highlighted ? A2_COLORS.primary : A2_COLORS.cardBorder,
  border: '1px solid',
  borderRadius: A2_BORDER_RADIUS.lg,
})

export const inputStyle = (focused = false) => ({
  backgroundColor: focused ? 'rgba(15, 15, 30, 0.8)' : A2_COLORS.inputBg,
  borderColor: focused ? A2_COLORS.primary : A2_COLORS.inputBorder,
  color: A2_COLORS.text,
  borderWidth: '1px',
  borderRadius: A2_BORDER_RADIUS.md,
})

export const buttonPrimaryStyle = (disabled = false) => ({
  backgroundColor: disabled ? 'rgba(90, 90, 150, 0.4)' : A2_COLORS.primary,
  color: A2_COLORS.text,
  borderRadius: A2_BORDER_RADIUS.lg,
})

export const buttonSecondaryStyle = () => ({
  backgroundColor: 'transparent',
  borderColor: A2_COLORS.primaryMuted,
  border: '1px solid',
  color: A2_COLORS.text,
  borderRadius: A2_BORDER_RADIUS.lg,
})

export const progressBarStyle = (progress: number) => ({
  backgroundColor: A2_COLORS.primaryMuted,
  borderRadius: A2_BORDER_RADIUS.full,
  height: '8px',
  position: 'relative' as const,
  overflow: 'hidden' as const,
})

export const progressFillStyle = (progress: number) => ({
  backgroundColor: A2_COLORS.primary,
  height: '100%',
  width: `${Math.min(progress, 100)}%`,
  transition: 'width 0.3s ease-in-out',
})

// No white borders rule - enforce consistent styling
export const assertNoWhiteBorder = (style: any) => {
  if (style.borderColor === '#fff' || style.borderColor === 'white' || style.borderColor === 'rgb(255, 255, 255)') {
    console.warn('[v0] WARNING: White border detected. Use A2 color palette instead.')
    return false
  }
  return true
}
