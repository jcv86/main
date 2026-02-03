## FIX #1: Corrección de Orden de Prioridades en UI

**Scores de Travis:**
- Energía: 42/100
- Enfoque: 50/100
- Relaciones: 50/100
- Plan Ejecutivo: 20/100

**Orden CORRECTO (por fricción, menor score = mayor fricción):**

PRIORITY 1 (MÁXIMA FRICCIÓN):
- Plan Ejecutivo: 20/100 ✓

PRIORITY 2 (FRICCIÓN MEDIA):
- Energía: 42/100 ✓

PRIORITY 3 & 4 (FRICCIÓN BAJA - EMPATE 50/50):
Cuando hay empate, usar regla de desempate:
- Opción A: Orden alfabético → Enfoque, Relaciones
- Opción B: Orden editorial → Relaciones (conexión primero), Enfoque (concentración)
- Opción C: Dependencia → Energía debe venir antes que Enfoque (necesitas energía para concentrarte)

**RECOMENDACIÓN FINAL (por dependencia lógica):**

```
PRIORITY 1: Plan Ejecutivo (20) - MÁXIMA FRICCIÓN
PRIORITY 2: Energía (42) - MEDIA (requiere energía para todo)
PRIORITY 3: Enfoque (50) - BAJA (necesita energía para concentrarse)
PRIORITY 4: Relaciones (50) - BAJA (consecuencia de energía/enfoque)
```

**Cambio en PersonalizedActionPlan component:**

```typescript
// Calculate priority order
const pillarsByPriority = [
  { pilar: 'plan_ejecutivo', score: scores.plan_ejecutivo, priority: 1 },
  { pilar: 'energia', score: scores.energia, priority: 2 },
  { pilar: 'enfoque', score: scores.enfoque, priority: 3 },
  { pilar: 'relaciones', score: scores.relaciones, priority: 4 },
].sort((a, b) => a.score - b.score) // Lower score = higher priority

// Display in UI with correct priority numbers
```
