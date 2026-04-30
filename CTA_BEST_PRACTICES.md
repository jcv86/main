# CTA & Button Flow Best Practices Guide
**Implementation standards for Despega Tu Carrera**

---

## Core Philosophy

> **Users should never be confused about what to do next.**
>
> Each screen guides users toward ONE clear action. Secondary options are available but never compete with the primary CTA.

---

## The Despega User Journey

```
START
  ↓
Bienvenida → A2 → A3 → A4 → END
(Welcome) (Planning) (Training) (Execution)
```

Each page should facilitate moving to the NEXT step without distraction.

---

## Design Pattern 1: Hero CTA (Intro Pages)

**Used on**: bienvenida, a2/intro, a3-intro, a4-intro

### Structure
```
┌──────────────────────────────┐
│   [Icon/Badge]               │
│   Heading (H1)               │
│   Description (2-3 lines)    │
│                              │
│ [FULL-WIDTH PRIMARY CTA]     │
│ Comenzar el Viaje            │
│ → (arrow icon)               │
└──────────────────────────────┘
```

### Code Example
```tsx
export default function Page() {
  return (
    <main className="min-h-screen bg-black flex items-center justify-center p-4">
      <Card className="bg-gradient-to-br from-purple/10 to-blue/10 max-w-2xl w-full">
        <CardContent className="pt-12 pb-12 px-8 text-center space-y-6">
          {/* Icon/Badge */}
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-purple/30 flex items-center justify-center">
              <span className="text-3xl">🚀</span>
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-4xl font-bold text-white">
            Bienvenido al Viaje de Transformación
          </h1>

          {/* Description */}
          <p className="text-lg text-white/80 max-w-xl mx-auto">
            Tu camino hacia la excelencia en entrevistas y desarrollo 
            profesional está dividido en 4 pilares fundamentales.
          </p>

          {/* PRIMARY CTA - ONLY BUTTON */}
          <div className="pt-4">
            <Button
              onClick={() => router.push('/despega/conozcamonos-1')}
              className="w-full bg-purple/80 hover:bg-purple/70 text-white py-6 px-8 text-lg font-semibold rounded-lg"
            >
              Comenzar el Viaje
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>

          {/* OPTIONAL: Secondary link (NOT button) */}
          <p className="text-sm text-white/60 pt-2">
            Questions? <a href="#help" className="text-purple hover:underline">Learn more</a>
          </p>
        </CardContent>
      </Card>
    </main>
  )
}
```

### Rules
✅ DO:
- One and only ONE filled button
- Full width or very prominent
- Button uses primary brand color (purple/80)
- Arrow icon on right side
- Clear, action-oriented text
- Optional secondary link (not button) below

❌ DON'T:
- Multiple buttons of equal prominence
- "Learn More" as a button (use link)
- Competing CTAs
- Tiny buttons
- Text-only next step

---

## Design Pattern 2: Linear Journey Flow

**Used on**: a2-routes, any multi-step completion page

### Structure
```
┌──────────────────────────────┐
│ Content Section              │
│ - Progress indicators        │
│ - Achievements              │
│ - Resources                 │
└──────────────────────────────┘
         ↓
┌──────────────────────────────┐
│ Your Next Step               │
│                              │
│ 1. Complete Phase 1          │
│    Description of phase...   │
│                              │
│ 2. Then Do This             │
│    Description...            │
│    [PRIMARY CTA BUTTON]      │
│                              │
│ Need help?                  │
│ <link>Talk to coach</link>  │
└──────────────────────────────┘
```

### Code Example
```tsx
export default function Page() {
  return (
    <main className="space-y-12 pb-12">
      {/* Content sections */}
      <ProgressTracker />
      <Achievements />
      <ResourceLibrary />

      {/* NEXT STEPS - Clear linear flow */}
      <div className="pt-8 border-t border-white/10">
        <Card className="bg-gradient-to-r from-purple/20 to-blue/20 border-2 border-purple/40">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white text-2xl">
              <CheckCircle2 className="w-6 h-6" />
              Tu Siguiente Paso
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Step 1 */}
            <div className="space-y-3">
              <p className="text-white/90 text-lg font-bold">
                1. Completa tu ruta de 90 días
              </p>
              <p className="text-white/80">
                Trabaja en las 3 fases de tu plan personalizado.
                Marca cada tarea completada.
              </p>
            </div>

            {/* Step 2 - WITH PRIMARY CTA */}
            <div className="space-y-3">
              <p className="text-white/90 text-lg font-bold">
                2. Accede a Entrenamiento Intensivo
              </p>
              <p className="text-white/80 mb-4">
                Practica con entrenamientos avanzados y prepárate 
                para entrevistas reales.
              </p>

              {/* PRIMARY CTA - ONLY FILLED BUTTON */}
              <Button
                onClick={() => router.push('/despega/a3')}
                className="w-full bg-purple/80 hover:bg-purple/70 py-6 text-base font-semibold"
              >
                Comenzar Entrenamiento Intensivo
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>

            {/* Support link - NOT button */}
            <div className="pt-4 border-t border-white/10">
              <p className="text-white/80 text-sm">
                💡 The plan is flexible. 
                <a href="#coach" className="text-purple hover:underline ml-1">
                  Talk to your coach
                </a> anytime.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
```

### Rules
✅ DO:
- Show progress/content FIRST
- Use numbered steps (1, 2, 3)
- ONE primary button (in step 2 or last step)
- Support contact as TEXT LINK only
- Clear progression ("1. Do this... 2. Then this...")

❌ DON'T:
- Multiple buttons at same level
- Competing CTAs
- Buttons for "Learn More" or "Help"
- Unclear step progression
- Text-only next steps

---

## Design Pattern 3: Dashboard with Tabs

**Used on**: a4/page.tsx, a2/dashboard

### Structure
```
┌──────────────────────────────┐
│ [Hero CTA - Optional]        │
│ Primary action for section   │
│ [BUTTON]                     │
└──────────────────────────────┘
         ↓
┌──────────────────────────────┐
│ [Tab Navigation]             │
│ Tab 1 | Tab 2 | Tab 3        │
└──────────────────────────────┘
         ↓
┌──────────────────────────────┐
│ Tab 1 Content                │
│ (with its own CTAs)          │
└──────────────────────────────┘
```

### Code Example
```tsx
export default function Page() {
  const [activeTab, setActiveTab] = useState('dashboard')

  return (
    <main className="space-y-8">
      {/* Optional: Hero CTA for primary action */}
      <Card className="bg-gradient-to-r from-purple/20 to-blue/20">
        <CardContent className="pt-6 space-y-4">
          <h2 className="text-2xl font-bold text-white">Comienza tus Entrenamientos</h2>
          <p className="text-white/80">Selecciona un escenario y practica ahora</p>
          <Button className="bg-purple/80 hover:bg-purple/70">
            Comenzar Sesión de Práctica
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </CardContent>
      </Card>

      {/* Tab Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="sessions">Sesiones</TabsTrigger>
          <TabsTrigger value="results">Resultados</TabsTrigger>
        </TabsList>

        {/* Tab Content - Each tab has own layout */}
        <TabsContent value="dashboard">
          <DashboardTab />
        </TabsContent>

        <TabsContent value="sessions">
          <SessionsTab />
        </TabsContent>

        <TabsContent value="results">
          <ResultsTab />
        </TabsContent>
      </Tabs>
    </main>
  )
}
```

### Rules
✅ DO:
- Optional hero CTA for most important action
- Tab navigation for different views
- Each tab content follows its own primary CTA pattern
- Landing tab is most important
- Tabs are for VIEWING, not decision points

❌ DON'T:
- Competing buttons within same tab
- Tabs with multiple CTAs of equal prominence
- Unclear what each tab does
- Too many tabs (limit to 3-5)

---

## Quick Reference: Button Styles

### Primary CTA Button
```tsx
className="w-full bg-purple/80 hover:bg-purple/70 text-white py-6 px-8 rounded-lg font-semibold text-base"
```

### Secondary Action Button
```tsx
className="w-full border-purple/50 hover:border-purple/40 text-white/80 hover:text-white py-3 px-6"
// OR ghost variant
className="text-white/60 hover:text-white/80 py-3 px-6"
```

### Tertiary Action (Link)
```tsx
className="text-purple/80 hover:text-purple/60 hover:underline text-sm"
```

---

## Anti-Patterns to AVOID

### ❌ Grid of Competing Buttons
```tsx
// WRONG - User doesn't know which to click
<div className="grid grid-cols-2 gap-4">
  <Button className="bg-purple/80">Option A</Button>
  <Button className="bg-blue/80">Option B</Button>
  <Button className="bg-green/80">Option C</Button>
  <Button className="bg-orange/80">Option D</Button>
</div>

// RIGHT - One primary action
<Button className="w-full bg-purple/80">Continuar a Entrenamientos</Button>
<div className="mt-4 text-center">
  <a href="#" className="text-purple hover:underline text-sm">Ver otras opciones</a>
</div>
```

### ❌ "Learn More" as a Button
```tsx
// WRONG - Competing with primary action
<Button>Comenzar</Button>
<Button variant="outline">Ver Guía</Button>

// RIGHT - Guide is a link
<Button className="w-full">Comenzar</Button>
<p className="text-sm mt-2">
  <a href="/guide" className="text-purple hover:underline">View guide</a>
</p>
```

### ❌ Vague Button Text
```tsx
// WRONG - User doesn't know what happens
<Button>Continuar</Button>
<Button>Siguiente</Button>
<Button>OK</Button>

// RIGHT - Clear, action-oriented
<Button>Comenzar Entrenamientos</Button>
<Button>Ir a Entrenamiento Intensivo</Button>
<Button>Descargar Progreso en PDF</Button>
```

---

## Implementation Checklist for New Pages

Before launching, verify:

- [ ] **One Primary CTA** clearly identified
- [ ] **Button Text Clear** - Verb + destination  
- [ ] **No Competing Buttons** - Secondary options are links
- [ ] **Mobile Responsive** - Full-width on mobile
- [ ] **Accessibility** - WCAG AA contrast, proper labels
- [ ] **Placement** - Natural end of content flow
- [ ] **Visual Hierarchy** - Primary CTA obviously most prominent
- [ ] **Brand Consistent** - Uses purple/80 color
- [ ] **User Tested** - Can user identify next step in <2 seconds?
- [ ] **Analytics Ready** - Click tracking in place

---

## Summary of Best Practices

1. **One Primary CTA per decision point**
2. **Secondary actions as links, not buttons**
3. **Clear, action-oriented button text**
4. **Visual hierarchy matters** (size, color, placement)
5. **Mobile-first responsive design**
6. **Accessibility is non-negotiable**
7. **Measure and iterate** based on data
8. **Consistency** across all pages

---

**Version**: 1.0  
**Last Updated**: April 30, 2026  
**Maintained By**: Design & Engineering Teams  
**Review Frequency**: Quarterly
