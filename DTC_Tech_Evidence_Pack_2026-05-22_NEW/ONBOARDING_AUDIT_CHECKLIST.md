# CAMBIOS REQUERIDOS POR ARCHIVO - Onboarding Flow

## Convención: Cambiar Referencias Técnicas a Amigables

### Mapping:
- "Conozcámonos 1" o "C1" → "Conozcámonos 1" (mantener, es amigable)
- "A1" → "El Ritual - Quién Eres Ahora" o "Despega Cerebral"
- "Test DISC" → "Tu Evaluación de Liderazgo"
- "DISC Result" → "Tu Perfil"
- "DISC" → "Despega Cerebral" o "Tu Perfil"
- "Conozcámonos 2" o "C2" → "Conozcámonos 2" (mantener)
- "Ruta" / "Route" → "Tu Puente de Transformación" o "Tu Ruta 30/60/90"
- "A2/A3/A4" → Ver brandbook para nombres específicos

## Archivos a Auditar/Corregir:

1. **app/despega/onboarding/page.tsx**
   - Cambiar importes: `DiscResultsPage` → `ProfileResultsPage`
   - Cambiar importes: `DISC_TEST_QUESTIONS` → `DESPEGA_CEREBRAL_QUESTIONS` o similar
   - Cambiar comentarios: "A1 test" → "El Ritual"
   - Cambiar comentarios: "A1 completed" → "El Ritual completado"
   - Cambiar UI labels relacionados a DISC

2. **app/despega/conozcamonos-1/page.tsx**
   - Cambiar `bg-gradient-to-br from-slate-900` → usar `bg-background`
   - Cambiar hardcoded colors a tokens del brandbook

3. **app/despega/ciclo-completo/page.tsx**
   - Auditar que use nombres amigables
   - Cambiar referencias a "A1/A2/A3/A4"

4. **components/conozcamonos-uno-component.tsx**
   - Ya fue actualizado pero revisar que sea consistente

5. **components/conozcamonos-dos-component.tsx**
   - Auditar nombres y colores

6. **components/disc-results-page.tsx**
   - Cambiar nombre a `profile-results-page.tsx`
   - Cambiar "DISC" a "Despega Cerebral"
   - Cambiar colores a tokens de brandbook

## Archivos de Datos/Configuración:
- `lib/disc-test-questions.ts` → Revisar si necesita cambio de nombre
- `lib/canon-conozcamonos-1-questions.ts` → OK (nombre amigable)

## Dark Mode Issues:
- C1 page usa `from-slate-900` hardcoded → Cambiar a `bg-background`
- Revisar otros usos de hardcoded colors en onboarding

---

## PRIORIDAD DE CAMBIOS:

1. **Alto**: onboarding/page.tsx (flujo principal)
2. **Alto**: conozcamonos-1/page.tsx (hardcoded colors)
3. **Medio**: disc-results-page.tsx (renombrar + actualizar)
4. **Medio**: conozcamonos-dos-component.tsx
5. **Bajo**: lib files (cambios menores)
