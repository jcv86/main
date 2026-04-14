# Guía: Aplicar Validación de Contexto a Todos los Tests

## Visión General
Todos los tests del sistema (A1, A2, A3, A4, DISC, MBTI, etc.) deben validar que la respuesta del usuario está contextualmente relacionada con la pregunta antes de aceptarla.

## Hook Reutilizable
Se creó `useContextValidation` en `/lib/hooks/use-context-validation.ts` que:
- Valida si la respuesta es relevante a la pregunta usando OpenAI
- Maneja errores gracefully (si API falla, permite respuesta)
- Proporciona estado de validación y mensajes de error

## Uso del Hook

### Importar
```typescript
import { useContextValidation } from '@/lib/hooks/use-context-validation'
```

### Inicializar
```typescript
const { validateContextRelevance, isValidating, validationError, clearError } = useContextValidation()
```

### Validar Respuesta
```typescript
const validation = await validateContextRelevance(
  question,           // string: la pregunta
  userResponse,       // string: respuesta del usuario
  testType           // string: 'a1' | 'a2' | 'a3' | 'a4' | 'disc' | 'mbti' | etc (opcional)
)

if (!validation.isRelevant) {
  // Mostrar error: validation.reason
  setError(validation.reason || 'Respuesta no relacionada')
  return
}

// Proceder con la respuesta aceptada
```

## Respuesta del Hook
```typescript
{
  isRelevant: boolean,      // true si es relevante, false si no
  confidence: number,       // 0-1 indicador de confianza de la validación
  reason?: string          // Motivo si es rechazada o mensaje
}
```

## Tests a Actualizar (Prioridad)

### FASE 1: Simulaciones (Alto Impacto)
- [ ] `components/conversational-interview-simulator.tsx` ✅ HECHO
- [ ] `components/conversational-interview.tsx` - A3 Conversational
- [ ] `components/a3-interview-simulation.tsx` - A3 Interview
- [ ] `components/a1-coach-interactive.tsx` - A1 Coaching

### FASE 2: Tests Estructurados
- [ ] `components/a3-behavioral-feedback.tsx` - A3 Behavioral
- [ ] `components/a3-employability-diagnosis.tsx` - A3 Employability
- [ ] `components/disc-results-page.tsx` - DISC Test
- [ ] A2 Test Components

### FASE 3: Tests de Autoconocimiento
- [ ] MBTI Test (`app/test/mbti/`)
- [ ] Big Five Test (`app/test/big-five/`)
- [ ] DISC Test (`app/test/disc/`)
- [ ] RIASEC Test (`app/test/riasec/`)
- [ ] Emotional Intelligence (`app/test/emotional-intelligence/`)

## Patrón de Implementación

### 1. Agregar Hook
```typescript
import { useContextValidation } from '@/lib/hooks/use-context-validation'

// En el componente:
const { validateContextRelevance } = useContextValidation()
```

### 2. En handleSubmit
```typescript
const handleSubmit = async (response: string) => {
  // 1. Validar contexto
  const validation = await validateContextRelevance(
    currentQuestion,
    response,
    'test-type-here'
  )

  if (!validation.isRelevant) {
    setError(validation.reason)
    return
  }

  // 2. Proceder con la lógica existente
  // ... resto de tu código
}
```

### 3. Mostrar Error
```typescript
{error && (
  <Alert variant="destructive">
    <AlertTriangle className="h-4 w-4" />
    <AlertDescription>{error}</AlertDescription>
  </Alert>
)}
```

## API Endpoint
Usa: `/api/validate-interview-response`

Request:
```json
{
  "question": "string",
  "response": "string",
  "testType": "string" (opcional),
  "language": "es" (default)
}
```

Response:
```json
{
  "isRelevant": true|false,
  "confidence": 0-1,
  "reason": "string"
}
```

## Consideraciones
1. **Fail-safe**: Si API falla, permite respuesta (mejor UX que bloquear)
2. **Lenguaje**: Soporta español por defecto, personalizable por idioma
3. **Test Types**: Pasar el tipo de test para mejor contexto (a1, a2, etc)
4. **Error Messages**: Usar razones específicas del API cuando estén disponibles

## Ejemplo Completo: A1 Coach Interactive

```typescript
'use client'
import { useContextValidation } from '@/lib/hooks/use-context-validation'

export function A1CoachInteractive() {
  const { validateContextRelevance, validationError, clearError } = useContextValidation()
  const [response, setResponse] = useState('')

  const handleSendResponse = async () => {
    // Validar contexto
    const validation = await validateContextRelevance(
      currentQuestion.text,
      response,
      'a1-interview'
    )

    if (!validation.isRelevant) {
      // Error ya está en validationError del hook
      return
    }

    // Proceder con tu lógica
    submitResponse(response)
  }

  return (
    <>
      <textarea value={response} onChange={(e) => setResponse(e.target.value)} />
      {validationError && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{validationError}</AlertDescription>
        </Alert>
      )}
      <Button onClick={handleSendResponse}>Enviar</Button>
    </>
  )
}
```

## Testing
Para testear el endpoint:
```bash
curl -X POST http://localhost:3000/api/validate-interview-response \
  -H "Content-Type: application/json" \
  -d '{
    "question": "Cuéntame sobre ti",
    "response": "Estoy probando el micrófono",
    "language": "es"
  }'
```

Respuesta esperada:
```json
{
  "isRelevant": false,
  "confidence": 0.95,
  "reason": "Tu respuesta no está relacionada con la pregunta..."
}
```
