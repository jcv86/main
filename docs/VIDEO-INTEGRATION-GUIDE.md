# Video Integration Guide: Avatar System in A3

## Overview
Tu sistema de 6 avatares está completamente integrado con A2-Routes. Los videos de saludo, pensamiento y despedida se reproducen en A3 durante las simulaciones de entrevista.

## 6 Avatars Integrated

### 1. **Sofía Navarro** - Orientadora Profesional
- **Nivel**: Básico (1)
- **Especialidad**: Fundamentos y confianza
- **Días recomendados en A2**: 15, 20
- **Videos necesarios**:
  - `greeting`: Sofía se presenta como orientadora, establece ambiente seguro
  - `thinking`: Sofía reflexiona mientras el candidato responde
  - `farewell`: Sofía proporciona retroalimentación constructiva y motivadora

### 2. **Andrés Rojas** - Reclutador Técnico
- **Nivel**: Intermedio (2)
- **Especialidad**: Habilidades técnicas y cultura empresa
- **Días recomendados en A2**: 31, 35, 42
- **Videos necesarios**:
  - `greeting`: Andrés explica rol técnico y expectativas
  - `thinking`: Andrés analiza respuestas técnicas
  - `farewell`: Andrés da feedback sobre alignment técnico

### 3. **Valentina Muñoz** - Jefa de Equipo
- **Nivel**: Intermedio+ (3)
- **Especialidad**: Liderazgo y gestión de equipos
- **Días recomendados en A2**: 42, 48, 52
- **Videos necesarios**:
  - `greeting`: Valentina explica dinámica de equipo y responsabilidades
  - `thinking`: Valentina procesa respuestas con rigor
  - `farewell`: Valentina feedback sobre liderazgo y cultura

### 4. **Mateo Silva** - Co-founder Startup
- **Nivel**: Intermedio+ (3)
- **Especialidad**: Versatilidad y emprendimiento
- **Días recomendados en A2**: 48, 55, 60
- **Videos necesarios**:
  - `greeting`: Mateo explica cultura startup y velocidad
  - `thinking`: Mateo piensa rápido, enfocado en ownership
  - `farewell`: Mateo feedback sobre mentalidad emprendedora

### 5. **Camila Rivera** - VP Product & Strategy
- **Nivel**: Avanzado (4)
- **Especialidad**: Pensamiento estratégico
- **Días recomendados en A2**: 60, 70, 75
- **Videos necesarios**:
  - `greeting`: Camila establece expectativas ejecutivas altas
  - `thinking`: Camila piensa estratégicamente, desafiante
  - `farewell`: Camila feedback sobre pensamiento sistémico

### 6. **Rafael Araya** - Senior Advisor & Coach
- **Nivel**: Avanzado (4)
- **Especialidad**: Liderazgo ejecutivo y mentalidad
- **Días recomendados en A2**: 75, 82, 90
- **Videos necesarios**:
  - `greeting`: Rafael presenta como mentor ejecutivo, establece tono mentor
  - `thinking`: Rafael reflexiona profundamente sobre respuestas
  - `farewell`: Rafael feedback como coach ejecutivo

## Video Playback in A3

### When Videos Play

**1. Greeting Phase**
- Usuario entra en A3
- Sistema detecta `avatar_id` de query parameter (ej: `?avatar=sofia-navarro`)
- Video de greeting se reproduce automáticamente
- Avatar se presenta y explica el contexto de la entrevista
- Usuario ve video completo antes de comenzar preguntas

**2. Between Questions (Thinking Pause)**
- Usuario proporciona respuesta a pregunta
- Avatar está procesando respuesta (IA analyzes)
- Video de thinking se reproduce en background
- Simula que el avatar está pensando/evaluando
- Después del video, avatar proporciona siguiente pregunta

**3. Farewell Phase**
- Entrevista se completa (3-5 preguntas)
- Video de farewell se reproduce
- Avatar despide al candidato
- Se transiciona a pantalla de feedback/score
- Usuario ve evaluación completa

## Technical Implementation

### File Structure
```
/videos/avatars/
├── sofia-greeting.mp4
├── sofia-thinking.mp4
├── sofia-farewell.mp4
├── andres-greeting.mp4
├── andres-thinking.mp4
├── andres-farewell.mp4
... (repeat for each avatar)
```

### Avatar Config Reference
```typescript
// lib/avatar-config.ts
AVATAR_CONFIG = {
  'sofia-navarro': {
    videos: {
      greeting: '/videos/avatars/sofia-greeting.mp4',
      thinking: '/videos/avatars/sofia-thinking.mp4',
      farewell: '/videos/avatars/sofia-farewell.mp4'
    }
  }
  // ... 5 more avatars
}
```

### A2-Routes Integration
```typescript
// In task-detail-modal.tsx
const handlePracticeWithAvatar = () => {
  const recommendedAvatars = getRecommendedAvatars(task.day)
  if (recommendedAvatars.length > 0) {
    const avatarId = recommendedAvatars[0]
    // Link to A3 with pre-selected avatar
    window.location.href = `/despega/a3?avatar=${avatarId}&day=${task.day}`
  }
}
```

## User Experience Flow

### For Day 15 (Mes 1 - Foundations)
1. Usuario abre modal de Día 15
2. Ve botón "Practicar con Avatar" (aparece porque Día 15 → Sofía)
3. Click en botón → va a A3 con Sofía preseleccionada
4. Sofía greeting video plays (calming, motivating)
5. Usuario responde 3 preguntas
6. Sofía thinking video entre preguntas
7. Sofía farewell video + feedback constructivo

### For Day 75 (Mes 3 - Mastery)
1. Usuario abre modal de Día 75
2. Ve botón "Practicar con Avatar" (Rafael preseleccionado)
3. Click → va a A3 con Rafael
4. Rafael greeting video plays (executive, challenging tone)
5. Usuario responde preguntas más difíciles
6. Rafael thinking video (pensamiento profundo)
7. Rafael farewell + feedback ejecutivo

## Benefits of This Integration

1. **Progressive Difficulty**: Avatares aumentan en dificultad alineado con curriculum
2. **Contextual Learning**: Cada avatar representa rol diferente que usuario encontrará
3. **Motivation**: Videos humaniza experiencia, no es solo chatbot
4. **Habit Formation**: Conexión clara entre días del curriculum y práctica con avatares
5. **Measurement**: Sistema puede trackear qué avatares practicó y scores por avatar

## Next Steps (If Not Yet Implemented)

1. Upload video files to `/public/videos/avatars/` directory
2. Verify A3 reads video URLs from `AVATAR_CONFIG`
3. Test video playback in greeting, thinking, farewell phases
4. Add video duration to config for timing optimization
5. Add fallback text if videos don't load
