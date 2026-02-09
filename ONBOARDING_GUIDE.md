# Onboarding Visual de Despega - Guía Completa

## 📋 Descripción General

El nuevo onboarding de Despega es un flujo visual y sencillo que guía a los usuarios a través de 4 pasos principales con flechitas animadas que indican el camino a seguir.

## 🎯 Los 4 Pasos del Onboarding

### Paso 1: Bienvenida (Intro)
- **Duración**: 30 segundos
- **Objetivo**: Explicar la plataforma de forma visual
- **Elementos**:
  - Título principal: "Bienvenido a Despega"
  - Flujo visual con 4 pasos numerados
  - Flechitas animadas (↓) entre pasos
  - Botón CTA: "Comenzar"
  - Estadísticas: 4 Pilares, 90 Días

```
┌─────────────────┐
│  1. Elige ruta  │
└────────┬────────┘
         ↓
┌─────────────────┐
│  2. Diagnóstico │
└────────┬────────┘
         ↓
┌─────────────────┐
│  3. Resultados  │
└────────┬────────┘
         ↓
┌─────────────────┐
│  4. Comienza    │
└─────────────────┘
```

### Paso 2: Selección de Camino
- **Duración**: 1-2 minutos
- **Objetivo**: Entender qué camino seguirá el usuario
- **Opciones**:
  - 🧠 Camino Persona (desarrollo personal)
  - 🚀 Camino Profesional (desarrollo de carrera)
  - Ambos (recomendado)
- **Elementos Visuales**:
  - Tarjetas interactivas con checkbox
  - Escalado al pasar mouse (transform hover:scale-105)
  - Iconos y tags descriptivos
  - Color de enfoque para selección

### Paso 3: Diagnóstico (Test)
- **Duración**: 5-7 minutos
- **Preguntas**: 8 totales
- **Categorías**:
  - 2 sobre Energía ⚡
  - 2 sobre Enfoque 🎯
  - 2 sobre Relaciones 🤝
  - 2 sobre Plan Ejecutivo 💡
- **Elementos**:
  - Barra de progreso (0-100%)
  - Numeración: "Pregunta X de 8"
  - Botones Anterior/Siguiente
  - Validación antes de avanzar

### Paso 4: Resultados
- **Duración**: 2-3 minutos
- **Muestra**:
  - Nivel detectado (Principiante/Intermedio/Avanzado)
  - Porcentaje total (0-100%)
  - 4 tarjetas con puntuaciones por dimensión
  - Barras de progreso por área
  - Botón "Ir a mi Dashboard"

## 🎨 Diseño Visual

### Paleta de Colores
```
- Azul (Energía): #3B82F6
- Verde (Enfoque): #10B981
- Naranja (Relaciones): #F97316
- Púrpura (Plan Ejecutivo): #A855F7
- Fondo: Gradiente azul a gris
```

### Tipografía
```
- Títulos: 3xl, 4xl, 5xl - Font Bold
- Subtítulos: lg, xl - Font Semibold
- Cuerpo: base, sm - Font Regular
```

### Espaciado
```
- Contenedor max: 2xl (28rem)
- Gap entre cards: 1.5rem (24px)
- Padding cards: 1.5rem a 2.5rem
```

## 🔧 Componentes Utilizados

### ArrowFlow
```tsx
<ArrowFlow direction="down" animated size="md" color="text-blue-500" />
```
- **Props**:
  - `direction`: 'down' | 'right' (default: 'down')
  - `animated`: boolean (default: true)
  - `color`: string - clase Tailwind
  - `size`: 'sm' | 'md' | 'lg' (default: 'md')

### StepBadge
```tsx
<StepBadge number={1} completed={false} current={true} />
```
- Muestra número del paso
- Cambia de color según estado
- Verde cuando completado ✓

### ProgressStep
```tsx
<ProgressStep 
  title="Elige tu Camino"
  description="Persona, Profesional o Ambos"
  number={1}
  current={true}
/>
```

## 📊 Flujo de Datos

### Guardado en Base de Datos
1. **despega_user_profiles**
   - `onboarding_completed`: boolean
   - `camino_persona_active`: boolean
   - `camino_profesional_active`: boolean
   - `camino_foco`: 'persona' | 'profesional' | 'ambos'

2. **despega_a1_test_results**
   - `score_energia`: 0-100
   - `score_enfoque`: 0-100
   - `score_relaciones`: 0-100
   - `score_plan_ejecutivo`: 0-100
   - `nivel_detectado`: 'principiante' | 'intermedio' | 'avanzado'

3. **despega_pilar_progress** (inicializado)
   - Progress: 10 para A1, 0 para otros

4. **despega_rankings** (inicializado)
   - Scores iniciales según caminos seleccionados

## 🎬 Animaciones

### Flechitas Animadas
```css
animate-bounce /* Flechas principales */
animate-pulse /* Flechas secundarias */
hover:scale-105 /* Cards al pasar mouse */
```

### Transiciones
```css
transition-all /* Cambios de color/border */
duration-200 /* Velocidad estándar */
```

## 📱 Responsive Design

```
Mobile (< 768px):
- Layout vertical
- Cards 100% ancho
- Botones full-width

Desktop (≥ 768px):
- Máx 28rem ancho
- Centrado en pantalla
- Grid 2 cols en resultados
```

## ✅ Checklist de Testing

- [ ] Paso 1: Las flechitas rebotan
- [ ] Paso 2: Las tarjetas se animan al seleccionar
- [ ] Paso 3: La barra de progreso avanza suave
- [ ] Paso 4: Los resultados se calculan correctamente
- [ ] Mobile: Todo es responsive
- [ ] Datos: Se guardan en Supabase correctamente
- [ ] Redirect: Va a /despega después de completar
- [ ] Validación: No permite avanzar sin responder

## 🚀 Próximas Mejoras

- [ ] Animación de entrada/salida entre pasos
- [ ] Confetti al completar onboarding
- [ ] Tooltip con tips sobre cada área
- [ ] Opción de saltar pasos
- [ ] Email de confirmación
- [ ] Share resultados en redes sociales

## 📞 Soporte

Para preguntas sobre el onboarding, revisa:
- `/app/despega/onboarding/page.tsx` - Lógica principal
- `/components/onboarding-utils.tsx` - Componentes auxiliares
- `DESPEGA_MIGRATION_COMPLETE.md` - Contexto de la plataforma
