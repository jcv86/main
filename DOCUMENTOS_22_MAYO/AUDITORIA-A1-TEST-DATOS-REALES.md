# AUDITORÍA: A1 Test - Datos Reales vs Mock

## Resumen Ejecutivo
✅ **TODO LOS DATOS DEL TEST A1 SON REALES**, no hay mockup. El flujo es 100% dinámico.

---

## 1. Cálculo de Scores DISC ✅

### Función `calculateResults()` en onboarding (línea 110)
```typescript
const calculateResults = async () => {
  const scores = { D: 0, I: 0, S: 0, C: 0 }
  
  // Lee TODAS las respuestas del usuario
  DISC_TEST_QUESTIONS.forEach((q) => {
    const response = responses[q.id]
    if (response?.mas) scores[response.mas] += 2    // Usuario eligió "más"
    if (response?.menos) scores[response.menos] -= 1 // Usuario eligió "menos"
  })
  
  // Normaliza a escala 0-100
  const normalizedScores = {
    D: Math.max(0, Math.min(100, Math.round((scores.D + 56) / 1.12))),
    I: Math.max(0, Math.min(100, Math.round((scores.I + 56) / 1.12))),
    S: Math.max(0, Math.min(100, Math.round((scores.S + 56) / 1.12))),
    C: Math.max(0, Math.min(100, Math.round((scores.C + 56) / 1.12))),
  }
  
  // Identifica perfil dominante (el score más alto)
  const sorted = Object.entries(normalizedScores)
    .sort(([, a], [, b]) => b - a)
    .map(([key]) => key as "D" | "I" | "S" | "C")
  
  // Resultado REAL basado en respuestas
  const finalResults = {
    ...normalizedScores,
    dominantProfile: sorted[0],      // D, I, S o C (determinado por scores)
    secondaryProfile: sorted[1],      // Segundo más alto
    total: (normalizedScores.D + normalizedScores.I + normalizedScores.S + normalizedScores.C) / 4,
  }
  
  setResults(finalResults)  // RESULTADO REAL, NO HARDCODEADO
}
```

**Verificación**: Si Travis responde todas preguntas diferente, sus scores cambiarán dinámicamente.

---

## 2. Guardado en Base de Datos ✅

### Endpoint `/api/despega/save-test-results` (route.ts)

**Paso 1: Obtiene usuario autenticado**
```typescript
const { data: { user }, error: authError } = await supabase.auth.getUser()
if (authError || !user) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
}
```

**Paso 2: Guarda en `a1_tests_results` tabla**
```typescript
const { error: a1TestError } = await supabase
  .from("a1_tests_results")
  .insert({
    user_id: user.id,
    test_name: "Despega Cerebral",
    test_type: "personality",
    score: Math.round((scores.D + scores.I + scores.S + scores.C) / 4),
    profile_type: dominantProfile,  // Perfil real calculado
    responses: {
      d_score: Math.round(scores.D),
      i_score: Math.round(scores.I),
      s_score: Math.round(scores.S),
      c_score: Math.round(scores.C),
      dominant_profile: dominantProfile,
      secondary_profile: secondaryProfile,
    },
    completed_at: new Date().toISOString(),
  })
```

**Paso 3: También guarda en `unified_test_results`**
```typescript
const { data: testData, error: testError } = await supabase
  .from("unified_test_results")
  .insert({
    user_email: user.email,
    test_type: "personality_assessment",
    test_results: {
      d_score: Math.round(scores.D),
      i_score: Math.round(scores.I),
      s_score: Math.round(scores.S),
      c_score: Math.round(scores.C),
      dominant_profile: dominantProfile,
      secondary_profile: secondaryProfile,
    },
  })
```

**Paso 4: Crea conexión A2 (recomendaciones personalizadas)**
```typescript
const a2Recommendations = generateA2Recommendations(dominantProfile, secondaryProfile)

const { data: a2SuggestedRoutes } = await supabase
  .from('a2_suggested_routes')
  .insert({
    user_id: user.id,
    perfil_dominante: dominantProfile,   // REAL
    perfil_secundario: secondaryProfile,  // REAL
    rutas_recomendadas: a2Recommendations, // Personalizadas
    disc_scores: {
      d: Math.round(scores.D),
      i: Math.round(scores.I),
      s: Math.round(scores.S),
      c: Math.round(scores.C),
    },
  })
```

**Verificación BD**: Después de que Travis completa el test, podés revisar:
- `SELECT * FROM a1_tests_results WHERE user_id = 'travis-id'`
- Verás su perfil real (D/I/S/C) con scores

---

## 3. Mostrado en Results Page ✅

### Componente `disc-results-page.tsx`

**Recibe datos reales vía props:**
```typescript
interface ResultsProps {
  results: {
    D: number              // Score real (0-100)
    I: number              // Score real (0-100)
    S: number              // Score real (0-100)
    C: number              // Score real (0-100)
    dominantProfile: "D" | "I" | "S" | "C"  // Real
    secondaryProfile: "D" | "I" | "S" | "C" // Real
    total: number
  }
}
```

**Muestra scores reales:**
```typescript
export function DiscResultsPage({ results }) {
  const profile = results.dominantProfile  // D, I, S, o C (basado en cálculo real)
  
  return (
    <div>
      {/* Muestra TODOS los 4 scores reales */}
      <div className="grid grid-cols-4 gap-4">
        {(['D', 'I', 'S', 'C'] as const).map((key) => (
          <div key={key}>
            <div className="text-3xl font-bold">{results[key]}</div>  {/* Score REAL */}
            <p>{scoreData[key]}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
```

**Personaliza explicaciones según perfil:**
```typescript
const profileData = {
  D: {
    name: 'Impulsor - Orientado a Resultados',
    description: 'Eres directo, decidido y enfocado en lograr objetivos.',
    strengths: ['Tomas decisiones rápidas', 'Estableces objetivos claros', ...],
  },
  I: { /* ... */ },
  S: { /* ... */ },
  C: { /* ... */ },
}

const pData = profileData[profile]  // Se selecciona según perfil REAL
```

**Las explicaciones están templadas (correcto):**
- No son datos mock, son **plantillas de texto** personalizadas por perfil
- Cada persona que sea "D" verá el MISMO texto descriptivo de D
- Pero su D score (por ej: 78) es ÚNICO y REAL

---

## 4. Flujo Completo: Verificación End-to-End

| Etapa | Tipo | Verificación |
|-------|------|---|
| 1. Usuario responde 28 preguntas | REAL | Cada respuesta está en `responses` state |
| 2. Se calculan scores | REAL | Fórmula dinámica según respuestas |
| 3. Se identifica perfil dominante | REAL | Se ordena scores y toma el más alto |
| 4. Se guarda en BD | REAL | 3 tablas reciben datos: a1_tests_results, unified_test_results, despega_user_profiles |
| 5. Se genera recomendaciones A2 | REAL | Se basan en perfil calculado |
| 6. Se muestra en página results | REAL | Componente recibe props con datos guardados |

---

## 5. Qué SÍ está Templado/Hardcodeado (Correcto)

Estas son PLANTILLAS DE DESCRIPCIÓN, no datos del test:

✓ **Descripciones de perfiles** (textos sobre "Impulsor", "Catalizador", etc.)
- Estos textos son iguales para TODOS los usuarios con el mismo perfil
- Esto es correcto - son explicaciones educativas

✓ **Frases de fortalezas/debilidades**
- Por ej: "Tomas decisiones rápidas" para todos los D
- Esto es correcto - son patrones generales del perfil

❌ **Lo que NO está templado (datos reales):**
- Scores D/I/S/C → REALES, calculados dinámicamente
- Perfil dominante → REAL, identificado por algoritmo
- Guardado en BD → REAL, cada usuario tiene registros únicos

---

## 6. Conclusión

✅ **El test A1 es 100% REAL**
- Calcula scores dinámicamente según respuestas
- Guarda datos en BD (múltiples tablas)
- Muestra resultados personalizados según cálculo real
- Conecta con A2 automáticamente

⚠️ **Las explicaciones de perfiles son plantillas** (CORRECTO)
- No es mock, es pedagogía
- Es lo mismo que mostraría LiderDISC

✅ **Cada usuario obtiene resultados únicos**
- Si Travis cambia una respuesta, su perfil cambia
- Si responde de otra forma, otro usuario obtiene otro perfil

---

## Cómo Verificar en Producción

### 1. Cambiar una respuesta y ver si cambian los scores
```
Si Travis en pregunta 5 elige "D" en lugar de "I"
Esperado: Sus scores DEBEN cambiar dinámicamente
```

### 2. Revisar BD directamente
```sql
SELECT * FROM a1_tests_results WHERE user_id = 'travis-uuid';
-- Verás su perfil real con scores únicos
```

### 3. Revisar rutas A2 generadas
```sql
SELECT * FROM a2_suggested_routes WHERE user_id = 'travis-uuid';
-- Verás recomendaciones personalizadas según SU perfil
```

---

**AUDITORÍA COMPLETADA**: ✅ Datos reales, sin mockup.
