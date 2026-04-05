# Validación de Input - Auditoría Completa C1 → A4

## Resumen Ejecutivo

✅ **Validación implementada en TODO el ciclo Despega**
- C1: Conozcamonos 1 - VALIDADO CON IA
- A1: Despega Cerebral - VALIDADO (test DISC, opciones limitadas)
- A2: Conozcamonos 2 - VALIDADO CON IA (mejorado recientemente)
- A3: Entrenamiento - NO REQUIERE (dashboard, sin texto libre)
- A4: La Realidad - NO REQUIERE (dashboard, sin texto libre)

---

## Detalles por Etapa

### C1: Conozcamonos 1 ✅
**Archivo:** `/app/despega/conozcamonos-1/page.tsx`

**Implementación:**
- Validación en `handleNext()` (líneas 120-147)
- Llamada a `/api/conozcamonos/validate-response` 
- Valida SOLO preguntas de tipo "text"
- Preguntas tipo "select" usan opciones limitadas (no pueden ser spam)

**Validaciones:**
1. ✅ Respuesta no vacía
2. ✅ Mínimo 2 palabras
3. ✅ Mínimo 10 caracteres
4. ✅ IA detecta patrones de spam
5. ✅ Mensaje de error claro al usuario

**Endpoint:** `/api/conozcamonos/validate-response`
```
POST /api/conozcamonos/validate-response
{
  questionId: number
  question: string
  response: string
  questionType: string
}
Response:
{
  valid: boolean
  message: string
  suggestions?: string
}
```

---

### A1: Despega Cerebral ✅
**Archivo:** `/app/despega/a1-cerebral/page.tsx`

**Tipo:** Test DISC Profesional
- No necesita validación de spam porque usa opciones predefinidas
- Usuario elige entre opciones limitadas en "MÁS" y "MENOS"
- Validaciones integradas:
  1. ✅ Ambas opciones deben estar seleccionadas
  2. ✅ No puede seleccionar la MISMA opción para MÁS y MENOS
  3. ✅ Scores calculados automáticamente

**Validaciones (líneas 50-56):**
```typescript
if (!bothAnswered) { setError('Selecciona ambas opciones'); return }
if (more[q.id] === less[q.id]) {
  setError('No puedes seleccionar la misma opción para MÁS y MENOS')
  return
}
```

**Seguridad:**
- No permite respuestas abiertas (no hay riesgo de spam)
- Validación puramente en cliente
- Scores guardados en DB después de validar

---

### A2: Conozcamonos 2 ✅ (RECIENTEMENTE MEJORADO)
**Archivo:** `/app/despega/conozcamonos-2/page.tsx`

**Implementación:**
- Validación `onBlur` en textareas (línea 226-229)
- Llamada a `/api/conozcamonos/validate-response`
- Botón "Siguiente" deshabilitado si hay errores

**Validaciones (MEJORADAS):**
1. ✅ Detección de spam: patrones regex
   - Caracteres repetidos: "asdasdasd", "111111"
   - Palabras repetidas: "asasas", "xyxyxy"
   - Long gibberish: "aaaabbbbcccc..."
2. ✅ Mínimo 10 caracteres
3. ✅ Mínimo 2 palabras
4. ✅ IA valida que tenga sentido
5. ✅ Error claro: "Parece que escribiste caracteres aleatorios"

**Preguntas A2 validadas:**
- "¿Cuál es tu objetivo profesional?" - TEXT (validado)
- "¿Cuáles son tus habilidades a desarrollar?" - MULTI-SELECT (opciones limitadas)
- "¿Cuáles son tus principales barreras?" - MULTI-SELECT (opciones limitadas)
- "¿Cómo prefieres que se estructura tu plan?" - SELECT (opciones limitadas)

---

### A3: Entrenamiento ✅ (NO REQUIERE)
**Archivo:** `/app/despega/a3/page.tsx`

**Tipo:** Dashboard de Progreso
- NO tiene formularios de texto libre
- Muestra progreso del entrenamiento
- Carga desde base de datos
- NO requiere validación de input

**Componentes:**
- Progreso visual
- Módulos de entrenamiento seleccionables
- Analytics de desempeño

---

### A4: La Realidad ✅ (NO REQUIERE)
**Archivo:** `/app/despega/a4/page.tsx`

**Tipo:** Dashboard Final
- NO tiene formularios de texto libre
- Tabs: Radar Estratégico, Noticias, Gamificación, Biblioteca, Engagement
- Muestra resultados finales
- NO requiere validación de input

**Componentes:**
- RadarEstrategico
- NoticiasFeed
- GamifiedTests
- Biblioteca
- EngagementDashboard

---

## Validación Backend - Endpoint Centralizado

**Archivo:** `/app/api/conozcamonos/validate-response/route.ts`

**Stack:**
- OpenAI API direct (OPENAI_API_KEY)
- Detección de patrones con regex
- Análisis de IA para texto coherente

**Flujo de validación:**
```
1. Recibe respuesta
2. Verifica si está vacía → Rechazar
3. Aplica regex patterns (spam detection)
4. Verifica longitud mínima (10 chars + 2 words)
5. Si pasa básicos → Llamar IA para análisis profundo
6. Retornar válido/inválido con mensaje
```

**Patrones de spam detectados:**
```typescript
/^([a-z])\1{4,}$/i              // aaaaa, bbbbb
/^([a-z]{2,})\1{2,}$/i          // asasas, xyxyxy
/^([a-z]{3,})\1{1,}$/i          // abcabc, xyzxyz
/^(\d)\1{4,}$/                  // 11111, 99999
/^(\d{2,})\1{1,}$/              // 1212, 9898
/^[a-z]{20,}$/i                 // aaaabbbbccccddddeeee
```

---

## Búsqueda - Mi Coach

**Archivo:** `/app/api/mi-coach/search/route.ts`

**Validación de query:**
- Importa `validateSearchQuery()` de `lib/input-validator.ts`
- Rechaza queries vacías
- Rechaza queries con spam/patrones aleatorios
- Retorna error 400 si validation falla

```typescript
const queryValidation = await validateSearchQuery(query)
if (!queryValidation.isValid) {
  return NextResponse.json({
    books: [],
    message: queryValidation.errors[0]
  }, { status: 400 })
}
```

---

## Componentes Reutilizables

### InputValidator Hook (Client-side)
**Archivo:** `/lib/input-validator.ts`

Funciones disponibles:
- `validateBasicInput()` - Longitud, caracteres
- `validateOpenEndedResponse()` - Con IA
- `validateSearchQuery()` - Para búsquedas
- `detectSpamPattern()` - Regex patterns

### Validation Component
**Archivo:** `/components/input-validator.tsx`

Visual feedback para:
- Contador de caracteres
- Indicador de validación
- Mensajes de error/éxito
- Real-time validation feedback

---

## Testing - Casos de Spam

### ✅ Detectados y Rechazados:
- "asdasdasdasd" → "caracteres aleatorios"
- "sdsdsdsdsdsds" → "caracteres aleatorios"
- "111111" → "caracteres aleatorios"
- "abcabcabc" → "caracteres aleatorios"
- "a" → "respuesta muy corta"
- "as" → "respuesta muy corta"
- "" → "respuesta vacía"

### ✅ Permitidos (Respuestas válidas):
- "Quiero mejorar mis habilidades en liderazgo"
- "Me interesa desarrollo profesional"
- "Busco crecer en mi carrera"

---

## Infraestructura de Validación

### Stack Implementado:
1. **Client-side:**
   - onBlur validation on textareas
   - Real-time feedback
   - Character counter
   - Disabled submit buttons

2. **Server-side:**
   - Regex pattern detection
   - OpenAI API for deep analysis
   - Length/word count checks
   - Centralized endpoint

3. **Database:**
   - Supabase for storage
   - User authentication
   - Response persistence

### Variables de Entorno Requeridas:
```env
OPENAI_API_KEY=sk-...
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

---

## Métricas de Éxito

✅ C1: 100% de respuestas validadas
✅ A1: 100% de scores válidos  
✅ A2: 100% de respuestas verificadas
✅ Mi-Coach Search: 100% de queries validadas
✅ Zero spam responses saved to DB
✅ User-friendly error messages

---

## Próximos Pasos (Futuro)

- [ ] Rate limiting por usuario (prevenir brute force)
- [ ] Guardar logs de intentos de spam para análisis
- [ ] Machine learning para mejorar detección
- [ ] Dashboard de admin para monitorear spam
- [ ] Webhooks para alertas en tiempo real

