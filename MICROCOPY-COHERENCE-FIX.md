## FIX #2: Coherencia de Microcopy - Misiones Bloqueadas vs "Sin Presión"

**PROBLEMA:**
En resultados A1 dices: "accede a las 5 misiones del ciclo 30 (sin presión de orden)"
Pero luego en modal: "Bloqueada – completa misión 1 primero"

Esto es **contradicción** en UX.

---

## SOLUCIÓN: Elegir UN modelo (recomendación: Secuencial con Alivio)

### OPCIÓN A: Completamente Libre (Recomendado para A1 Exploration)
**Descripción:** 5 misiones disponibles simultáneamente, usuario elige orden.

**Microcopy en resultados:**
```
"Accede a las 5 misiones del ciclo 30.
Eres libre de elegir el orden que más te haga sentido.
No hay presión ni secuencia obligatoria."
```

**Modal de misiones:**
```
┌──────────────────────────────────────┐
│ MISIÓN 1: Tu Anclaje Semanal        │
│ Día 1-7 | ⏱ 30 min | 🎁 25 pts     │
│ [Comenzar Misión]                  │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│ MISIÓN 2: Las 3 Cosas Críticas      │
│ Día 1-7 | ⏱ 45 min | 🎁 30 pts     │
│ [Comenzar Misión]   ← NO BLOQUEADA  │
└──────────────────────────────────────┘
```

**Ventaja:** Matches "sin presión" copy.
**Desventaja:** Usuario podría "romper" narrativa si hace M5 antes que M1.

---

### OPCIÓN B: Secuencial Explícito (Recomendado para Coherencia)
**Descripción:** 5 misiones en orden estricto, cada una desbloquea la siguiente.

**Microcopy en resultados (CORREGIDO):**
```
"Accede a las 5 misiones del ciclo 30 (paso a paso, sin presión).
Cada misión se desbloquea después de la anterior.
Esto permite que cada observación construya sobre la última."
```

**Modal de misiones:**
```
┌──────────────────────────────────────┐
│ MISIÓN 1: Tu Anclaje Semanal        │
│ [✓ Disponible] → [Comenzar]         │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│ MISIÓN 2: Las 3 Cosas Críticas      │
│ [🔒 Desbloquea después de M1]        │
└──────────────────────────────────────┘
```

**Ventaja:** Coherencia total entre copy y UX.
**Desventaja:** Menos "libertad" (aunque es ilusoria si solo M1 tiene sentido).

---

## RECOMENDACIÓN FINAL

**Usar OPCIÓN B (Secuencial Explícito)** porque:

1. ✓ Cada misión construye sobre la anterior (narrativamente coherente)
2. ✓ Copy y UX alineados ("paso a paso" = secuencial)
3. ✓ Reduces cognitive load (no "¿cuál hago primero?")
4. ✓ Mantiene "sin presión" porque no hay competencia ni puntos comparativos
5. ✓ Sofia guía el flujo de forma más natural

**Cambios de microcopy:**

ANTES (Confuso):
> "accede a las 5 misiones del ciclo 30 (sin presión de orden)"

DESPUÉS (Claro):
> "accede a las 5 misiones del ciclo 30 (paso a paso, cada una construye sobre la anterior)"
