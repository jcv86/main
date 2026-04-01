# BRANDBOOK PARA COMPONENTES COMPARTIDOS

## Componentes Core

### Botones (Button)
```tsx
/* El Ritual */
<Button className="bg-pilar-ritual hover:bg-pilar-ritual text-white">
  Comenzar El Ritual
</Button>

/* Exploración */
<Button className="bg-pilar-exploracion hover:bg-pilar-exploracion text-white">
  Generar Mi Misión 90 Días
</Button>

/* Entrenamiento */
<Button className="bg-pilar-entrenamiento hover:bg-pilar-entrenamiento text-white">
  Siguiente Entrevista
</Button>

/* La Realidad */
<Button className="bg-pilar-realidad hover:bg-pilar-realidad text-white">
  Ver Radar Estratégico
</Button>
```

### Cards por Pilar
```tsx
/* El Ritual Card */
<Card className="border-l-4 border-pilar-ritual bg-pilar-ritual/5">
  <CardHeader className="border-b border-pilar-ritual/20">
    <CardTitle className="text-pilar-ritual">El Ritual - Quién Eres Ahora</CardTitle>
  </CardHeader>
</Card>

/* Exploración Card */
<Card className="border-l-4 border-pilar-exploracion bg-pilar-exploracion/5">
  <CardHeader className="border-b border-pilar-exploracion/20">
    <CardTitle className="text-pilar-exploracion">Exploración - Aprende Nuevas Formas</CardTitle>
  </CardHeader>
</Card>
```

### Progress Tracker
```tsx
/* Muestra los 3 pilares principales */
<div className="space-y-4">
  <div className="flex items-center gap-4">
    <div className="w-12 h-12 rounded-full bg-pilar-ritual flex items-center justify-center text-white font-bold">
      1
    </div>
    <div className="flex-1">
      <h3 className="font-bold text-pilar-ritual">El Ritual - Quién Eres Ahora</h3>
      <p className="text-sm text-muted-foreground">Descubre tu verdadero perfil</p>
    </div>
  </div>
  
  <div className="flex items-center gap-4">
    <div className="w-12 h-12 rounded-full bg-pilar-exploracion flex items-center justify-center text-white font-bold">
      2
    </div>
    <div className="flex-1">
      <h3 className="font-bold text-pilar-exploracion">Exploración - Aprende Nuevas Formas</h3>
      <p className="text-sm text-muted-foreground">Construye tu Misión 90 Días</p>
    </div>
  </div>
</div>
```

### Typography
```tsx
/* Jerarquía por importancia */

/* H1 - Títulos principales (página) */
<h1 className="text-4xl font-bold text-foreground">
  El Ritual - Quién Eres Ahora
</h1>

/* H2 - Títulos de sección */
<h2 className="text-2xl font-semibold text-foreground">
  Descubre tu perfil de liderazgo
</h2>

/* H3 - Subtítulos */
<h3 className="text-lg font-semibold text-foreground">
  ¿Cómo funciona?
</h3>

/* Body */
<p className="text-base text-foreground leading-relaxed">
  El Ritual es tu punto de partida. Con 6 evaluaciones científicas...
</p>

/* Caption / Metadata */
<p className="text-sm text-muted-foreground">
  Incluye DISC, Big Five, Inteligencia Emocional y más
</p>
```

### Icons
```tsx
/* Íconos deben ser representativos de pilares */

/* El Ritual - Meditation/Circle/Mirror */
<RitualIcon className="w-6 h-6 text-pilar-ritual" />

/* Exploración - Lightbulb/Compass/Book */
<ExplorationIcon className="w-6 h-6 text-pilar-exploracion" />

/* Entrenamiento - Target/Handshake/Practice */
<TrainingIcon className="w-6 h-6 text-pilar-entrenamiento" />

/* La Realidad - Globe/Market/Network */
<RealityIcon className="w-6 h-6 text-pilar-realidad" />
```

---

## Validación de Componentes

### Checklist
- ✅ Botones usan colores de pilares, NO hardcoded
- ✅ Cards tienen border-l-4 por pilar + background/5
- ✅ Tipografía respeta jerarquía
- ✅ Íconos son representativos
- ✅ Dark mode testeado
- ✅ Contraste WCAG AA mínimo
- ✅ Sin referencias a "A1/A2/A3/A4"
- ✅ Sin "DISC" - siempre "Perfil de Liderazgo"
- ✅ Sin "Test" - usar "Evaluación"

---

## Patrones de Uso Prohibidos

❌ `bg-blue-600` → Use `bg-pilar-exploracion`  
❌ `text-purple-600` → Use `text-pilar-ritual`  
❌ `border-blue-500` → Use `border-pilar-exploracion`  
❌ "A1 Assessment" → Use "El Ritual - Quién Eres Ahora"  
❌ "DISC Profile" → Use "Perfil de Liderazgo"  
❌ "Take the test" → Use "Comienza la evaluación"

---

## Integración con CSS Variables

Todos los componentes **DEBEN** usar CSS variables, NO hardcoded colors:

```css
/* globals.css ya tiene definido */
--pilar-ritual: 270 84.6% 55.1%;           /* #A855F7 */
--pilar-exploracion: 217.2 91.2% 59.8%;    /* #3B82F6 */
--pilar-entrenamiento: 33 97.1% 58.8%;     /* #F97316 */
--pilar-realidad: 189.5 96.4% 64.7%;       /* #06B6D4 */
```

Luego en Tailwind (`tailwind.config.ts`):

```ts
pilar: {
  ritual: "hsl(var(--pilar-ritual))",
  exploracion: "hsl(var(--pilar-exploracion))",
  entrenamiento: "hsl(var(--pilar-entrenamiento))",
  realidad: "hsl(var(--pilar-realidad))",
}
```

---

## Dark Mode
Los colores de pilares son iguales en light y dark mode. No necesitan override.

```tsx
/* Correcto - funciona en ambos modos */
<div className="bg-pilar-ritual text-white">

/* Evitar */
<div className="bg-purple-600 dark:bg-purple-400 text-white">
```

---

## Resumen

**Regla de Oro**: Todo componente compartido debe:
1. Usar variables CSS para colores
2. Usar nombres amigables de pilares
3. Ser accesible (contraste WCAG AA)
4. Funcionar en dark mode sin overrides
5. Ser responsive mobile-first
6. Ser reutilizable en cualquier pilar

**Fuente de Verdad**: `/vercel/share/v0-project/BRANDBOOK.md`
