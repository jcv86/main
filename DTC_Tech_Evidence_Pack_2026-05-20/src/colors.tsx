// Color system for the career development platform
export const colors = {
  // Main colors - minimal palette
  background: "hsl(0 0% 100%)", // Pure white
  foreground: "hsl(224 71.4% 4.1%)", // Dark gray

  // Card and surface colors
  card: "hsl(0 0% 100%)", // White
  cardForeground: "hsl(224 71.4% 4.1%)", // Dark gray

  // Muted colors for subtle elements
  muted: "hsl(220 14.3% 95.9%)", // Light gray
  mutedForeground: "hsl(220 8.9% 46.1%)", // Medium gray

  // Secondary colors
  secondary: "hsl(220 14.3% 95.9%)", // Light gray
  secondaryForeground: "hsl(220 9% 39.3%)", // Medium gray

  // Border and input colors
  border: "hsl(220 13% 91%)", // Light gray border
  input: "hsl(220 13% 91%)", // Light gray input

  // Ring color for focus states
  ring: "hsl(224 71.4% 4.1%)", // Dark gray

  // Destructive colors (red accent)
  destructive: "hsl(0 84.2% 60.2%)", // Red
  destructiveForeground: "hsl(0 0% 98%)", // White

  // Primary colors (using foreground)
  primary: "hsl(224 71.4% 4.1%)", // Dark gray
  primaryForeground: "hsl(0 0% 98%)", // White

  // Accent colors (subtle)
  accent: "hsl(220 14.3% 95.9%)", // Light gray
  accentForeground: "hsl(220 9% 39.3%)", // Medium gray

  // Popover colors
  popover: "hsl(0 0% 100%)", // White
  popoverForeground: "hsl(224 71.4% 4.1%)", // Dark gray
}

// CSS custom properties
export const cssVariables = `
:root {
  --background: 0 0% 100%;
  --foreground: 224 71.4% 4.1%;
  --card: 0 0% 100%;
  --card-foreground: 224 71.4% 4.1%;
  --popover: 0 0% 100%;
  --popover-foreground: 224 71.4% 4.1%;
  --primary: 224 71.4% 4.1%;
  --primary-foreground: 0 0% 98%;
  --secondary: 220 14.3% 95.9%;
  --secondary-foreground: 220 9% 39.3%;
  --muted: 220 14.3% 95.9%;
  --muted-foreground: 220 8.9% 46.1%;
  --accent: 220 14.3% 95.9%;
  --accent-foreground: 220 9% 39.3%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 0 0% 98%;
  --border: 220 13% 91%;
  --input: 220 13% 91%;
  --ring: 224 71.4% 4.1%;
  --radius: 0.5rem;
}
`

// Utility functions
export const getColor = (colorName: keyof typeof colors) => colors[colorName]

// Hover states
export const hoverMuted = "hsl(220 14.3% 92%)" // Slightly darker muted for hover

// Export default
export default colors
