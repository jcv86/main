# CTA & Button Flow Best Practices Guide

## For Developers Working on Despega

### Quick Start Rule
**ONE primary CTA per page section. Everything else is a link or outline button.**

---

## The Problem We're Solving

Users see multiple buttons and don't know which to click:
```
❌ WRONG:
┌─────────────────────────────────────────┐
│ Próximos Pasos                          │
├─────────────────────────────────────────┤
│ ┌───────────────┐  ┌───────────────┐   │
│ │ Ver Detalle   │  │ Avanzar a A3  │   │
│ └───────────────┘  └───────────────┘   │
│ ┌───────────────────────────────────┐   │
│ │ Hablar con el Coach               │   │
│ └───────────────────────────────────┘   │
└─────────────────────────────────────────┘
   "Which button should I click?" 🤔
```

---

## The Solution Pattern

```
✅ RIGHT:
┌─────────────────────────────────────────┐
│ Tu Siguiente Paso                       │
├─────────────────────────────────────────┤
│ 1. Complete your 90-day route          │
│    Work through 3 phases...             │
│                                         │
│ 2. Then access Intensive Training       │
│    ┌─────────────────────────────────┐  │
│    │ Comenzar Entrenamiento Intensivo│  │
│    │           →                      │  │
│    └─────────────────────────────────┘  │
│                                         │
│ 💡 The plan is flexible. Chat anytime  │
└─────────────────────────────────────────┘
   "Clear next step!" ✓
```

---

## The 5 Commandments

### 1. ONE Primary CTA Per Section
```typescript
// ✅ DO THIS
export function MyPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent>
          <h2>What You'll Learn</h2>
          <p>Details about the training...</p>
        </CardContent>
      </Card>
      
      {/* SINGLE primary CTA */}
      <Button className="w-full bg-purple/80 hover:bg-purple/70 py-6">
        Comenzar Entrenamientos
        <ArrowRight className="w-5 h-5 ml-2" />
      </Button>
    </div>
  )
}
```

```typescript
// ❌ DON'T DO THIS
export function MyPage() {
  return (
    <div className="grid grid-cols-3 gap-4">
      {/* Multiple competing buttons - WRONG! */}
      <Button className="bg-purple/80">Start Training</Button>
      <Button className="bg-blue/80">View Guide</Button>
      <Button className="bg-green/80">Chat Support</Button>
    </div>
  )
}
```

### 2. Secondary Actions Are Links/Outlines
```typescript
// ✅ DO THIS
<div className="space-y-4">
  {/* Primary filled button */}
  <Button className="w-full bg-purple/80">Primary Action</Button>
  
  {/* Secondary as link */}
  <Link href="/help" className="text-sm text-purple/80 hover:underline">
    View Help Guide →
  </Link>
  
  {/* Or as outline button */}
  <Button variant="outline" className="w-full">
    Secondary Action
  </Button>
</div>
```

```typescript
// ❌ DON'T DO THIS
<div className="grid grid-cols-2 gap-4">
  {/* Multiple filled buttons - confusing! */}
  <Button className="bg-purple/80">Action 1</Button>
  <Button className="bg-blue/80">Action 2</Button>
</div>
```

### 3. Show Clear Steps for Multi-Step Actions
```typescript
// ✅ DO THIS - Clear progression
<Card className="bg-gradient-to-r from-purple/20 to-blue/20 p-6">
  <CardContent className="space-y-6">
    {/* Step 1 */}
    <div className="space-y-2">
      <p className="text-lg font-bold">1. Complete Your Route</p>
      <p className="text-white/85">Work through phases 1-3...</p>
    </div>
    
    {/* Step 2 - with CTA */}
    <div className="space-y-3">
      <p className="text-lg font-bold">2. Access Intensive Training</p>
      <p className="text-white/85">Advanced practice sessions...</p>
      <Button className="w-full bg-purple/80">
        Ir a Entrenamientos Avanzados
        <ArrowRight className="w-5 h-5 ml-2" />
      </Button>
    </div>
  </CardContent>
</Card>
```

### 4. Button Text Must Be Clear & Specific
```typescript
// ✅ DO THIS - User knows exactly what happens
<Button>Comenzar Entrenamientos</Button>
<Button>Ir a Entrenamiento Intensivo</Button>
<Button>Ver Mi Progreso</Button>

// ❌ DON'T DO THIS - Vague/confusing
<Button>Continuar</Button>          // Where to?
<Button>Siguiente</Button>          // Next what?
<Button>OK</Button>                 // OK what?
<Button>Avanzar a A3</Button>       // Users don't know what A3 is
```

### 5. Use Visual Hierarchy to Show Importance
```typescript
// ✅ DO THIS - Clear priority
<div className="space-y-4">
  {/* Primary - large, filled, prominent */}
  <Button size="lg" className="w-full bg-purple/80 hover:bg-purple/70 h-12 text-base font-semibold">
    Primary Action (most important)
    <ArrowRight className="w-5 h-5 ml-2" />
  </Button>
  
  {/* Secondary - smaller, outline */}
  <Button variant="outline" size="sm" className="w-full">
    Secondary Action
  </Button>
  
  {/* Tertiary - link */}
  <Link href="/help" className="text-sm text-purple/80 hover:underline text-center block">
    Need help?
  </Link>
</div>
```

---

## Code Patterns by Page Type

### Pattern A: Single Action Page (a3-intro)
```typescript
export default function Page() {
  const router = useRouter()
  
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Hero with description */}
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">
          Section Title
        </h1>
        <p className="text-lg text-white/85">
          Description of what this section is about...
        </p>
      </div>
      
      {/* Key benefits/features */}
      <Card>
        <CardContent className="space-y-3">
          <div className="flex gap-3">
            <CheckCircle2 className="w-5 h-5 text-purple flex-shrink-0" />
            <p>Benefit 1</p>
          </div>
          <div className="flex gap-3">
            <CheckCircle2 className="w-5 h-5 text-purple flex-shrink-0" />
            <p>Benefit 2</p>
          </div>
        </CardContent>
      </Card>
      
      {/* SINGLE primary CTA at bottom */}
      <Button 
        onClick={() => router.push('/next-page')}
        className="w-full bg-purple/80 hover:bg-purple/70 py-6 text-base font-semibold"
      >
        Clear Action Description
        <ArrowRight className="w-5 h-5 ml-2" />
      </Button>
    </div>
  )
}
```

### Pattern B: Multi-Step Journey (a2-routes)
```typescript
export default function Page() {
  const router = useRouter()
  
  return (
    <div className="max-w-3xl mx-auto">
      {/* Main content sections */}
      <div className="space-y-6 mb-12">
        {/* ... your page content ... */}
      </div>
      
      {/* Single clear next step section */}
      <div className="pt-8 border-t border-white/10">
        <Card className="bg-gradient-to-r from-purple/20 to-blue/20 border-2 border-purple/40">
          <CardHeader>
            <CardTitle className="text-2xl">
              Tu Siguiente Paso
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 1 */}
            <div className="space-y-3">
              <p className="text-white/90 text-lg">
                <strong>1. Complete your 90-day route:</strong>
              </p>
              <p className="text-white/80">
                Work through 3 phases, mark tasks complete...
              </p>
            </div>
            
            {/* Step 2 - with CTA */}
            <div className="space-y-3">
              <p className="text-white/90 text-lg">
                <strong>2. Then access Intensive Training:</strong>
              </p>
              <p className="text-white/80 mb-4">
                Advanced practice and real interview prep...
              </p>
              <Button 
                onClick={() => router.push('/a3')}
                className="w-full bg-purple/80 hover:bg-purple/70 text-white py-6 text-base font-semibold"
              >
                Comenzar Entrenamiento Intensivo
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
            
            {/* Optional helpful tip */}
            <div className="p-4 bg-background/80 border border-white/10 rounded-lg">
              <p className="text-white/80 text-sm">
                <strong>💡 Tip:</strong> The plan is flexible. Chat with coach anytime.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
```

### Pattern C: Dashboard with Tabs
```typescript
export default function Page() {
  const [activeTab, setActiveTab] = useState('primary')
  
  return (
    <div className="space-y-8">
      {/* Hero with PRIMARY CTA if applicable */}
      <div>
        <h1 className="text-4xl font-bold mb-4">Dashboard Title</h1>
        <p className="text-white/85 mb-6">Description...</p>
        
        {/* Only show primary CTA if it's the main action */}
        <Button className="bg-purple/80 hover:bg-purple/70">
          Primary Action
        </Button>
      </div>
      
      {/* Tabs for different views */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="primary">Primary View</TabsTrigger>
          <TabsTrigger value="secondary">Secondary</TabsTrigger>
          {/* ... more tabs ... */}
        </TabsList>
        
        <TabsContent value="primary" className="space-y-4">
          {/* Content for primary tab */}
        </TabsContent>
      </Tabs>
    </div>
  )
}
```

---

## Common Mistakes to Avoid

### ❌ Mistake 1: Grid of Competing Buttons
```typescript
// WRONG - User doesn't know which to click
<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
  <Button className="bg-purple/80">Option 1</Button>
  <Button className="bg-blue/80">Option 2</Button>
  <Button className="bg-green/80">Option 3</Button>
</div>
```

✅ **Fix**: Make all but one into links/outlines
```typescript
<div className="space-y-4">
  <Button className="w-full bg-purple/80">Primary Option</Button>
  <Link href="/option2">Secondary Option</Link>
  <Link href="/option3">Tertiary Option</Link>
</div>
```

### ❌ Mistake 2: Confusing Button Text
```typescript
// WRONG - User confused
<Button>Avanzar a A3</Button>
<Button>Ir a Resultado</Button>
<Button>Continuar</Button>
```

✅ **Fix**: Be specific and clear
```typescript
<Button>Comenzar Entrenamientos Intensivos</Button>
<Button>Ver Mi Análisis de Progreso</Button>
<Button>Hablar con el Coach</Button>
```

### ❌ Mistake 3: Mixing Multiple Filled Buttons
```typescript
// WRONG - All look equally important
<div className="space-y-3">
  <Button className="bg-purple/80">Action 1</Button>
  <Button className="bg-blue/80">Action 2</Button>
  <Button className="bg-green/80">Action 3</Button>
</div>
```

✅ **Fix**: Only one filled, rest are outlines/links
```typescript
<div className="space-y-3">
  <Button className="w-full bg-purple/80">Primary Action</Button>
  <Button variant="outline" className="w-full">Secondary</Button>
  <Link>Tertiary Option</Link>
</div>
```

### ❌ Mistake 4: Scattered CTAs Without Clear Next Step
```typescript
// WRONG - Unclear progression
<div className="space-y-4">
  <Card with button>
  <Card with button>
  <Card with button>
  <Card with button>
  <!-- Where should user go? -->
</div>
```

✅ **Fix**: One clear "Next Step" section at bottom
```typescript
<div className="space-y-4">
  {/* Content cards without CTAs */}
  <Card>Content</Card>
  <Card>Content</Card>
  
  {/* Single clear next step at end */}
  <Card className="border-2 border-purple/40">
    <h3>Tu Siguiente Paso</h3>
    <Button>Ir a Siguiente Fase</Button>
  </Card>
</div>
```

---

## When to Break the Rules

### OK to Have Multiple Buttons When:
- They're all outline/ghost buttons (not filled)
- They're links, not buttons
- They're in a help/sidebar area (not main content flow)
- They're in a tab interface (one tab at a time)

### NOT OK to Have Multiple Filled Buttons:
- In hero section
- In primary content area
- As "next steps" at bottom of page
- When it confuses user about what to do next

---

## Testing Your CTA Flow

### Ask These Questions:
1. **Can user identify primary action in 2 seconds?**
   - YES ✅ = Good
   - NO ❌ = Too many CTAs/confusing layout

2. **Is button text clear about what happens next?**
   - "Comenzar Entrenamientos" ✅ Clear
   - "Continuar" ❌ Vague

3. **Are secondary actions clearly secondary?**
   - Links or outline buttons ✅ Good
   - Filled buttons ❌ Wrong

4. **Is there ONE obvious next step?**
   - YES ✅ User knows where to go
   - NO ❌ Need to simplify

---

## Questions & Answers

**Q: What if users need multiple options?**
A: Use a tab interface or separate sections. Only show one primary CTA per section.

**Q: Can we use secondary buttons for "Skip" or "Learn More"?**
A: YES - use outline/ghost buttons. These are secondary, not primary.

**Q: What about mobile responsiveness?**
A: Even MORE important on mobile. Users have less screen space, so clear priority is critical.

**Q: How many sections can a page have?**
A: As many as needed, but each section should have ONE primary CTA or NO CTA.

**Q: What about forms?**
A: Submit button is primary CTA. "Clear" and "Cancel" are outline/secondary.

---

## Document History
- **2026-04-30**: Initial best practices created
- Applies to: All pages in /despega directory
- Status: Live - review quarterly
