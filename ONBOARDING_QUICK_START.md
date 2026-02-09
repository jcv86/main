# Onboarding - Guía Rápida de Uso

## 🚀 Para Usuarios

### Cómo completar el onboarding

1. **Irá automáticamente si no ha completado onboarding**
   - URL: `/despega/onboarding`
   - Se redirige automáticamente después de login

2. **Los 4 pasos son lineales**
   ```
   Intro → Selecciona Camino → Responde Test → Ve Resultados
   ```

3. **Cada paso debe completarse antes de avanzar**
   - No puedes saltar pasos
   - Hay validaciones en cada pantalla

### Tiempo estimado: 10-12 minutos

---

## 🛠️ Para Desarrolladores

### Rutas y URLs

```
/despega/onboarding       ← Página principal (entrada)
/despega                  ← Dashboard (salida)
```

### Componentes Utilizados

```tsx
// Componentes de UI (del proyecto)
- Button
- Card, CardContent, CardHeader, CardTitle, CardDescription
- RadioGroup, RadioGroupItem
- Label
- Progress
- Checkbox

// Icons (lucide-react)
- ArrowRight, ArrowDown
- CheckCircle2
- Zap, Target, Users, Lightbulb

// Componentes personalizados
- ArrowFlow (flechitas animadas)
- StepBadge (números de pasos)
- ProgressStep (cards con pasos)
```

### Archivos Principales

```
app/despega/onboarding/page.tsx   ← Lógica principal
components/onboarding-utils.tsx   ← Componentes auxiliares
```

### Flujo de Estado

```typescript
type Step = "intro" | "camino" | "test" | "results"

// Estados manejados
- step: Step (paso actual)
- caminoPersona: boolean
- caminoProfesional: boolean
- currentQuestion: number
- responses: Record<number, number>
- results: ScoresObject
- loading: boolean
- userId: string | null
```

---

## 📊 Base de Datos

### Tablas que se modifican

1. **despega_user_profiles**
   ```sql
   UPDATE despega_user_profiles SET
     onboarding_completed = true,
     camino_persona_active = ?,
     camino_profesional_active = ?,
     camino_foco = ?,
     a1_test_completed = true
   ```

2. **despega_a1_test_results** (INSERT)
   ```sql
   INSERT INTO despega_a1_test_results (
     user_id,
     score_energia,
     score_enfoque,
     score_relaciones,
     score_plan_ejecutivo,
     nivel_detectado,
     respuestas_raw
   )
   ```

3. **despega_pilar_progress** (INIT)
   - Inicializa los 4 pilares
   - A1 Cerebral: 10 puntos iniciales

4. **despega_rankings** (INIT)
   - Inicializa ranking del usuario
   - Score general: 10 puntos

---

## 🎨 Customización

### Cambiar Colores

En `/app/despega/onboarding/page.tsx`, busca las clases Tailwind:

```tsx
// Paso 1
border-blue-200 bg-blue-50 → cambiar a otros colores

// Paso 2
border-blue-500 bg-blue-50 → Camino Persona
border-orange-500 bg-orange-50 → Camino Profesional

// Paso 3
animate-bounce → cambiar a animate-pulse si prefieres

// Paso 4
from-blue-50 to-purple-50 → cambiar gradiente
```

### Cambiar Textos

Busca estos strings:

```tsx
"Bienvenido a Despega"
"Tu plataforma de desarrollo integral"
"Diagnóstico Despega Cerebral"
etc.
```

### Añadir Preguntas

En la constante `TEST_A1_QUESTIONS`:

```tsx
{
  id: 9,  // Nuevo ID
  category: "energia",  // Una de las 4 categorías
  question: "Tu pregunta aquí",
  options: [
    { value: 1, label: "Opción 1" },
    // ... más opciones
  ]
}
```

---

## 🧪 Testing Manual

### Checklist

- [ ] Entra a `/despega/onboarding`
- [ ] Lee el paso 1, presiona "Comenzar"
- [ ] Selecciona al menos 1 camino
- [ ] Presiona "Siguiente"
- [ ] Responde todas las 8 preguntas
- [ ] Verifica que los resultados sean correctos
- [ ] Presiona "Ir a mi Dashboard"
- [ ] Verifica que se haya redirigido a `/despega`
- [ ] Verifica que se guardó en la BD (check en Supabase)
- [ ] Intenta entrar a `/despega/onboarding` de nuevo
  - Debe redirigirse automáticamente a `/despega`

### Testing en Mobile

```bash
# Abre DevTools en Chrome
F12 → Device Toolbar → Toggle device toolbar

# Prueba en:
- iPhone 12
- iPad
- Android
```

---

## 🐛 Debugging

### Ver errores en consola

```tsx
console.log("[v0] Current step:", step)
console.log("[v0] Responses:", responses)
console.log("[v0] Results:", results)
```

### Verificar guardado en BD

```sql
SELECT * FROM despega_user_profiles 
WHERE onboarding_completed = true
LIMIT 5;

SELECT * FROM despega_a1_test_results 
ORDER BY created_at DESC 
LIMIT 5;
```

### Problemas comunes

**Problema**: Se queda en el test
- **Solución**: Revisa que `userId` no sea null

**Problema**: No se guardan resultados
- **Solución**: Verifica permisos de RLS en Supabase

**Problema**: Se redirige al login
- **Solución**: Verifica que el usuario esté autenticado

---

## 📈 Métricas para Monitorear

### Events a trackear

```
- onboarding_started
- onboarding_step_completed (por step)
- camino_selected
- test_completed
- onboarding_finished
```

### Analytics SQL

```sql
-- Usuarios que completaron onboarding
SELECT COUNT(*) as total 
FROM despega_user_profiles 
WHERE onboarding_completed = true;

-- Tiempo promedio en test
SELECT AVG(EXTRACT(EPOCH FROM (created_at - user_created_at))/60) as avg_minutes
FROM despega_a1_test_results;

-- Distribución de niveles
SELECT nivel_detectado, COUNT(*) as total
FROM despega_a1_test_results
GROUP BY nivel_detectado;
```

---

## 🚀 Deployment

### Pre-Deployment Checklist

- [ ] Código testeado localmente
- [ ] Sin console.log de debug
- [ ] Animaciones suave en prod
- [ ] Mobile responsive verificado
- [ ] Redireccionamientos funcionando
- [ ] BD guardando datos correctamente

### Rollout Plan

```
1. Deploy a staging
2. Test flujo completo en staging
3. Verificar permisos RLS
4. Deploy a producción
5. Monitor errores primeras 2 horas
```

---

## 📞 Soporte y FAQ

**¿Puedo saltar el onboarding?**
- No, es lineal y obligatorio

**¿Se puede completar el onboarding sin responder todo?**
- No, hay validación en cada paso

**¿Cuánto tiempo se guarda en base de datos?**
- Para siempre (onboarding_completed = true)

**¿Puedo hacer el onboarding otra vez?**
- Tendría que borrar el registro de la BD

**¿Las preguntas son dinámicas?**
- Actualmente no, pero se pueden añadir más

---

## 🔗 Archivos Relacionados

- `ONBOARDING_GUIDE.md` - Guía completa
- `ONBOARDING_VISUAL_PREVIEW.md` - Cómo se ve
- `DESPEGA_MIGRATION_COMPLETE.md` - Contexto de Despega
- `app/despega/onboarding/page.tsx` - Código principal
- `components/onboarding-utils.tsx` - Componentes

