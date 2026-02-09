# Quick Reference - Despega Cerebral Test

## 🎯 Las 4 Dimensiones de Despega

| Dimensión | Preguntas | Qué Mide | Emoji |
|-----------|-----------|---------|-------|
| **Energía** | 1-5 | Gestión de energía vital | ⚡ |
| **Enfoque** | 6-10 | Concentración y ejecución | 🎯 |
| **Relaciones** | 11-15 | Conexiones significativas | 🤝 |
| **Plan Ejecutivo** | 16-20 | Visión a largo plazo | 🚀 |

---

## 📋 Estructura de Preguntas

```typescript
{
  id: 1,
  text: "Pregunta en español...",
  dimension: "energia_proactivo",  // ID único
  area: "energia",                  // Categoría (energia, enfoque, relaciones, plan_ejecutivo)
  category: "Aprovechamiento de Energía"  // Subcategoría
}
```

---

## 🧮 Cálculo de Scores

**Entrada:** Respuestas Likert 1-5

**Fórmula:**
```
Para cada área:
  1. Suma todas las respuestas del área
  2. Calcula promedio: (suma - cantidad) / cantidad / 4 * 100
  3. Resultado: 0-100 percentil
```

**Función:** `calculateDesperaScores()` en `disc-client.tsx`

---

## 📊 Interpretación de Scores

| Rango | Nivel | Acción |
|-------|-------|--------|
| **70-100** | Alto | Mantener y potenciar |
| **50-69** | Medio | Mejorar y desarrollar |
| **0-49** | Bajo | Enfoque prioritario |

---

## 🔗 Flujo Completo

```
1. Usuario: /test/disc
   └─ TestIntroScreen (información)
   
2. Usuario responde: 20 preguntas
   └─ Likert 1-5 por pregunta
   
3. Submit test
   └─ calculateDesperaScores()
   └─ UnifiedTestSystem.saveTestResult()
   
4. Guardado en Supabase
   └─ test_results table
   └─ results: { energia, enfoque, relaciones, plan_ejecutivo }
   
5. Redirección
   └─ /test/disc/results-despega
   └─ Muestra 4 scores + insights
```

---

## 📂 Archivos Clave

| Archivo | Función |
|---------|---------|
| `disc-questions.tsx` | Preguntas (20 total) |
| `disc-client.tsx` | Lógica del test + scoring |
| `results-despega/page.tsx` | Página de resultados |
| `page.tsx` | Metadata y enrutamiento |

---

## 🔧 Datos Guardados

```json
{
  "user_email": "user@example.com",
  "test_type": "Despega Cerebral",
  "results": {
    "energia": 75,
    "enfoque": 65,
    "relaciones": 85,
    "plan_ejecutivo": 70
  },
  "answers": { 
    "1": "5", "2": "4", ... 
  },
  "duration_minutes": 12,
  "completed_at": "2026-02-09T15:30:00Z"
}
```

---

## ⚡ Tips de Desarrollo

### Acceder a los datos del test
```typescript
// En disc-client.tsx
const resultado = await UnifiedTestSystem.loadTestResult(
  email, 
  "Despega Cerebral"
)

// Scores
resultado.data.results.energia      // 0-100
resultado.data.results.enfoque      // 0-100
resultado.data.results.relaciones   // 0-100
resultado.data.results.plan_ejecutivo // 0-100
```

### Mostrar UI de resultado
```typescript
// En results-despega/page.tsx
const score = resultado.energia;
const nivel = score >= 70 ? "Alto" : score >= 50 ? "Medio" : "Bajo";
```

### Crear planes personalizados
```typescript
// Por dimensión
switch(dimension) {
  case "energia":
    // Plan de energía
    break;
  case "enfoque":
    // Plan de enfoque
    break;
  // ...
}
```

---

## 🧪 URL de Prueba

- **Test:** `http://localhost:3000/test/disc`
- **Resultados:** `http://localhost:3000/test/disc/results-despega`
- **Demo:** `http://localhost:3000/test/disc/results-despega?demo=true`

---

## 📝 Textos Estándar

### Intro
- Nombre: "Despega Cerebral"
- Descripción: "Check-in de Autoconocimiento Profesional"
- Duración: ~15 minutos
- Preguntas: 20

### Insights por Dimensión

**Energía (Alto):** "Tienes excelente gestión de energía. Mantén tus hábitos consistentes..."

**Enfoque (Bajo):** "Necesitas mejorar tu concentración. Implementa técnicas de gestión de atención..."

**Relaciones (Medio):** "Buenas relaciones. Puedes profundizar invirtiendo más tiempo en escucha auténtica..."

**Plan Ejecutivo (Alto):** "Visión clara y ejecución efectiva. Eres muy capaz de materializar tus objetivos..."

---

## ✅ Checklist de Validación

- [ ] Las 20 preguntas cargan correctamente
- [ ] Respuestas Likert 1-5 se registran
- [ ] Scores se calculan 0-100 por dimensión
- [ ] Datos se guardan en Supabase
- [ ] Redirección funciona a `/test/disc/results-despega`
- [ ] Página de resultados muestra 4 scores
- [ ] Insights aparecer correctamente
- [ ] Recomendaciones son personalizadas
- [ ] Mobile responsive ✓

---

## 🔗 Recursos

- **Documentación completa:** `DESPEGA_CEREBRAL_MIGRATION.md`
- **Documentación técnica:** `DESPEGA_MIGRATION_COMPLETE.md`
- **Preguntas:** `/app/test/disc/disc-questions.tsx`
- **Scoring:** `/app/test/disc/disc-client.tsx` (función `calculateDesperaScores`)

---

**Última actualización:** 9 de Febrero 2026
**Estado:** ✅ Producción
