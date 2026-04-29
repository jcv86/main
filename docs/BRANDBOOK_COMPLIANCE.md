# Brandbook Compliance Guide

## Color System Standardization

All 370+ pages in this project have been standardized to follow the **Despega tu Carrera** brandbook color system.

### Semantic Color Tokens

Instead of hardcoding colors, use these semantic tokens defined in `app/globals.css`:

#### Phase Colors (4-Phase Career Development)
- `--color-phase-c1` - Career Discovery Phase
- `--color-phase-c2` - Career Positioning Phase  
- `--color-phase-a2` - Application Phase
- `--color-phase-a3` - Interview & Presentation Phase

#### Primary Colors
- `--color-primary` - Primary brand color (main actions)
- `--color-secondary` - Secondary brand color (supporting elements)
- `--color-accent` - Accent color (highlights, CTAs)
- `--color-tertiary` - Tertiary color (backgrounds, subtle elements)

#### Neutral Colors
- `--color-background` - Main background
- `--color-surface` - Card/surface backgrounds
- `--color-foreground` - Text on background
- `--color-muted` - Muted text/borders

#### Psychology Colors
- `--color-success` - Success states (green family)
- `--color-warning` - Warning states (yellow/orange family)
- `--color-danger` - Danger/error states (red family)
- `--color-info` - Information states (blue family)

### Usage Examples

**Do:**
```jsx
<div className="bg-background text-foreground">
  <button className="bg-primary hover:bg-primary/90 text-white">
    Action Button
  </button>
</div>
```

**Don't:**
```jsx
<div className="bg-white text-black">
  <button className="bg-blue-600 hover:bg-blue-700 text-white">
    Action Button
  </button>
</div>
```

## Standardization Status

✅ **Complete**: All 370+ pages have been automatically standardized using the `final-brandbook-color-standardization.sh` script.

### What Was Changed
1. Replaced hardcoded color values with semantic Tailwind classes
2. Updated all text colors to use `text-foreground` or phase-specific colors
3. Updated all background colors to use semantic tokens
4. Ensured brand colors are consistently applied across all components
5. Updated border colors to follow the neutral color system

## Checking Compliance

To verify a file is compliant:
1. Search for hardcoded colors like `text-red-500`, `bg-blue-600`
2. Look for `/40` or `/30` opacity modifiers (use full brightness or `/80-85` instead)
3. Ensure all text has sufficient contrast against its background

## Future Development

When adding new features or pages:
1. Use semantic color tokens from `globals.css`
2. Reference the BRANDBOOK.md for design specifications
3. Run ESLint with brandbook rules to catch violations
4. Never hardcode hex colors or hardcoded Tailwind colors

## Contact

For brandbook questions or design clarifications, refer to `BRANDBOOK.md` or the `/despega/design` reference page.
