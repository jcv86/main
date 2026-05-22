# AUDITORÍA DE FLUJO: Test DISC → Dashboard

## SIMULACIÓN COMPLETA DEL FLUJO

### PASO 1: USUARIO COMPLETA EL TEST
**Archivo:** `/app/despega/onboarding/page.tsx`

```
1. Usuario responde 28 preguntas DISC
   - Selecciona opción "MÁS como yo" → suma +2 puntos a esa dimensión
   - Selecciona opción "MENOS como yo" → resta -1 punto a esa dimensión

2. Al finalizar, se calcula:
   scores = { D: 15, I: -5, S: 20, C: 10 }
   
3. Se normalizan a escala 0-100:
   D: Math.max(0, Math.min(100, Math.round((15 + 56) / 1.12))) = 63
   I: Math.max(0, Math.min(100, Math.round((-5 + 56) / 1.12))) = 45
   S: Math.max(0, Math.min(100, Math.round((20 + 56) / 1.12))) = 68
   C: Math.max(0, Math.min(100, Math.round((10 + 56) / 1.12))) = 59

4. Se identifica:
   dominantProfile: 'S' (68 es el más alto)
   secondaryProfile: 'D' (63 es el segundo)
```

### PASO 2: ENVÍO AL API
**Archivo:** `/app/despega/onboarding/page.tsx` línea 82-104

```
fetch("/api/despega/save-test-results", {
  method: "POST",
  body: {
    dominantProfile: "S",
    secondaryProfile: "D",
    scores: { D: 63, I: 45, S: 68, C: 59 },
    caminoPersona: true,
    caminoProfesional: false
  }
})

LOGS ESPERADOS EN CONSOLA:
✓ "[v0] Save response status: 200"
✓ "[v0] Save response data: {success: true, data: {...}, progress: {...}}"
```

### PASO 3: PROCESAMIENTO EN API
**Archivo:** `/app/api/despega/save-test-results/route.ts`

```
1. Autentica usuario:
   user.id = "abc123" 
   user.email = "usuario@example.com"
   ✓ "[v0] User ID: abc123 Email: usuario@example.com"

2. Guarda en unified_test_results:
   {
     user_email: "usuario@example.com",
     test_type: "personality_assessment",
     test_results: {
       d_score: 63,
       i_score: 45,
       s_score: 68,
       c_score: 59,
       dominant_profile: "S",
       secondary_profile: "D",
       camino_persona: true,
       camino_profesional: false
     }
   }
   ✓ "[v0] Test results saved successfully: [{...}]"

3. Obtiene a1_progress actual:
   ✓ "[v0] Fetched progress data: {user_id: 'abc123', tests_completed: 0}"

4. Incrementa tests_completed:
   testsCompleted = 0 + 1 = 1
   ✓ "[v0] Progress updated successfully: [{user_id: 'abc123', tests_completed: 1, ...}]"

5. Verifica que se guardó correctamente:
   ✓ "[v0] Verified progress after update: {user_id: 'abc123', tests_completed: 1}"

6. Retorna respuesta:
   {
     success: true,
     data: [...test results...],
     progress: {...updated progress...}
   }
```

### PASO 4: REDIRECCIÓN AL DASHBOARD
**Archivo:** `/app/despega/onboarding/page.tsx` línea 95-98

```
if (response.ok) {
  // Espera 2 segundos
  setTimeout(() => {
    router.push("/dashboard?refetch=true")
  }, 2000)
}

RESULTADO: Se navega a /dashboard?refetch=true
```

### PASO 5: DASHBOARD DETECTA REFETCH
**Archivo:** `/components/dashboard-content.tsx` línea 83-96

```
shouldRefetch = searchParams?.get("refetch") === "true"

LOGS ESPERADOS:
✓ "[v0] Refetch triggered, waiting before reload..."
  → espera 800ms
✓ "[v0] Executing refetch..."
  → incrementa refreshKey (dispara loadData)
  → limpia URL a /dashboard
```

### PASO 6: DASHBOARD CARGA DATOS
**Archivo:** `/components/dashboard-content.tsx` línea 25-76

```
loadData() es llamado con nueva clave de refresh:

1. Obtiene a1_progress:
   ✓ "[v0] Progress data: {user_id: 'abc123', tests_completed: 1}"
   
   RESULTADO EN UI:
   Card "Tests Completados": 1
   Progress bar: 1/6 = 16.67%

2. Obtiene unified_test_results (más reciente):
   ✓ "[v0] Test results: {test_results: {s_score: 68, d_score: 63, ...}}"
   
   RESULTADO EN UI:
   "Mi Perfil de Personalidad"
   - D: 63%
   - I: 45%
   - S: 68%
   - C: 59%
   - Perfil Dominante: S

3. Obtiene goals:
   [...]

4. Obtiene reading_stats:
   [...]
```

## CHECKLIST DE VERIFICACIÓN

### En el navegador (DevTools Console):
- [ ] Ver "[v0] Save response status: 200"
- [ ] Ver "[v0] Fetched progress data: ..."
- [ ] Ver "[v0] Progress updated successfully: ..."
- [ ] Ver "[v0] Refetch triggered, waiting before reload..."
- [ ] Ver "[v0] Executing refetch..."
- [ ] Ver "[v0] Progress data: {... tests_completed: 1}"
- [ ] Ver "[v0] Test results: {...}"

### En el dashboard UI:
- [ ] "Tests Completados" muestra "1" (no 0)
- [ ] Progress bar de tests llena un 16.67%
- [ ] Aparece sección "Mi Perfil de Personalidad"
- [ ] Se muestran 4 tarjetas con D, I, S, C scores
- [ ] Perfil dominante se identifica correctamente

### En Supabase:
- [ ] unified_test_results tiene 1 registro con test_results completo
- [ ] a1_progress.tests_completed = 1
- [ ] campos camino_persona y camino_profesional están guardados

## POSIBLES PUNTOS DE FALLA

1. **Auth falló**: Usuario no autenticado → 401 error
2. **unified_test_results falló**: Error al insertar → test no se guarda
3. **a1_progress no existe**: PGRST116 error → hay que crear el registro primero
4. **a1_progress.user_id es NULL**: Constraint violation → no se actualiza
5. **RLS Policies bloquea lectura**: Dashboard no puede leer datos
6. **Delay insuficiente**: Dashboard recarga antes de que BD actualice
7. **RefreshKey no triggeando**: useEffect no se ejecuta con nuevo valor
