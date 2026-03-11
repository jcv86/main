# BRANDBOOK - Despega Tu Carrera

## Brand Identity

**Name:** Despega Tu Carrera
**Tagline:** Tu Siguiente Versión Empieza Aquí
**Core Purpose:** Acompañar transiciones de identidad profesional conscientes mediante tests científicos, exploración de narrativas, y coaching con IA personalizado.

**Core Values:**
- Empoderamiento sin juzgar
- Transformación consciente (no crisis)
- Acompañamiento científico + emocional
- Privacidad absoluta
- Narrativas de transformación reales

---

## Visual System

### Color Palette

#### Primary Colors
- **Primary Blue**: `hsl(221.2 83.2% 53.3%)` / `#3b82f6`
  - Light mode: Full vibrancy
  - Dark mode: `hsl(217.2 91.2% 59.8%)`
  - Used for: CTAs, highlights, interactive elements

#### Neutrals (Semantic)
- **Background**: `#ffffff` (light) / `#0f172a` (dark)
- **Foreground**: `hsl(222.2 84% 4.9%)` (text)
- **Card**: Matches background
- **Border**: `hsl(214.3 31.8% 91.4%)`
- **Muted**: `hsl(210 40% 96%)`
- **Muted Foreground**: `hsl(215.4 16.3% 46.9%)`

#### Accent (Secondary)
- **Accent**: `hsl(210 40% 96%)` 
- Used for: Supporting elements, alternates
- NOT used for primary CTAs

#### Status Colors
- **Destructive**: `hsl(0 84.2% 60.2%)` - Errors, warnings
- **Success**: `hsl(142.1 70.6% 45.3%)` - Completions, achievements
- **Info**: Primary Blue

### Typography

- **Font Family**: Inter (system)
- **Weight Scale**: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)
- **Size Scale**: 
  - `text-xs`: 12px
  - `text-sm`: 14px
  - `text-base`: 16px
  - `text-lg`: 18px
  - `text-xl`: 20px
  - `text-2xl`: 24px
  - `text-4xl`: 36px

#### Hierarchy
- **H1** (36px, bold): Page titles, main headings
- **H2** (24px, semibold): Section titles
- **H3** (20px, semibold): Subsection titles
- **Body** (16px, regular): Default text
- **Label** (14px, medium): Form labels, badges
- **Caption** (12px, regular): Metadata, hints

### Spacing Scale
- `2px`, `4px`, `8px`, `12px`, `16px` (1rem), `24px`, `32px`, `40px`, `48px`, `64px`
- Use gaps for component spacing, not margins
- Consistent padding: typically 16px-24px for card content

### Radius
- Default radius: `0.75rem` (12px)
- Used consistently across buttons, cards, inputs

### Shadows
- **Subtle**: `0 1px 2px 0 rgba(0, 0, 0, 0.05)`
- **Medium**: `0 4px 6px -1px rgba(0, 0, 0, 0.1)`
- **Large**: `0 20px 25px -5px rgba(0, 0, 0, 0.1)`
- **Hover**: Lift element with larger shadow

---

## Component Guidelines

### Buttons
- **Primary (CTA)**: Blue background, white text
- **Secondary**: Gray background, dark text
- **Ghost**: Transparent, text only
- **Disabled**: Muted opacity 50%
- **Loading**: Show spinner, disable interaction
- Minimal padding: `h-10` (2.5rem) standard

### Cards
- **Background**: White (light) / Dark slate (dark)
- **Border**: Optional, `border-border`
- **Shadow**: On hover, elevate
- **Padding**: 16px-24px internal spacing
- **Radius**: 12px standard

### Forms
- **Input/Textarea**: 
  - Border: `border-border`
  - Focus: Ring of primary color
  - Placeholder: Muted foreground
  - Disabled: Muted background
- **Labels**: Medium weight, clear contrast
- **Error**: Red border + error message in destructive color
- **Success**: Green checkmark, success color

### Progress/Status
- **Progress Bar**: Primary color, smooth transitions
- **Completed**: Green checkmark + accent color
- **In Progress**: Primary blue + pulse animation
- **Pending**: Muted gray + subtle styling

### Dark Mode
- All components must support dark mode
- Use CSS variables for colors (NOT hardcoded)
- Ensure WCAG AA contrast in both modes
- Dark backgrounds use dark slate, not black

---

## Messaging Guidelines

### Tone of Voice
- **Not**: Corporate, clinical, judgmental
- **Yes**: Empowering, scientific, reflective, personal
- Avoid "should", "must", "improve" (judgmental)
- Use: "expand", "discover", "explore", "contextualize"

### Language Standards
- **Spanish**: Primarily es-ES (Spain) with inclusive language
- **No DISC terminology**: Use "Despega Cerebral" (A1 test)
- **Narrative-focused**: Use transformation stories, not metrics
- **Inclusive**: No gender stereotypes, multiple identity paths

### Key Phrases
- "Tu siguiente versión"
- "Transformación consciente"
- "Descubre quién eres"
- "Sin juzgar, sin cambiar"
- "Tu puente de transición"

---

## Implementation Requirements

### All Components MUST:
1. Use CSS variables from `globals.css` (NOT hardcoded colors)
2. Support dark mode with proper contrast
3. Use semantic tokens: `foreground`, `background`, `primary`, `accent`, `muted-foreground`, `border`
4. Follow spacing scale (no arbitrary margins)
5. Include proper ARIA labels and accessible focus states
6. Work on mobile (responsive first)

### All Pages MUST:
1. Use Inter font via layout.tsx
2. Have clear visual hierarchy
3. Include proper SEO metadata
4. Follow color guidelines (max 3-5 colors per page)
5. Implement dark mode support
6. Have accessible contrast ratios (WCAG AA minimum)

### Sections (Consistent Across All)
- **Header**: Primary color for links/CTAs
- **Navigation**: Clear, accessible, responsive
- **Cards**: Hover states with elevation
- **Forms**: Proper validation, loading states
- **CTAs**: Primary blue, clear messaging
- **Footer**: Muted background, standard layout

---

## File References
- Color tokens: `app/globals.css` (lines 6-59)
- Tailwind config: `tailwind.config.ts`
- Design tokens CSS variables: See `:root` in globals.css
- Typography: `layout.tsx` imports Inter font

---

## Audit Checklist
- [ ] No hardcoded colors (use CSS variables)
- [ ] No "DISC" terminology
- [ ] All text uses semantic colors (foreground, muted-foreground)
- [ ] Dark mode supported and tested
- [ ] Spacing follows scale (no arbitrary px values)
- [ ] Cards, buttons, inputs follow guidelines
- [ ] Typography hierarchy is clear
- [ ] All components responsive
- [ ] Accessible contrast ratios
- [ ] Messaging uses brand tone
