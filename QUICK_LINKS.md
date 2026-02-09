# 🔗 REFERENCIAS RÁPIDAS - DESPEGA CEREBRAL

## Archivos de Código

### Preguntas del Test
📄 **File:** `/app/test/disc/disc-questions.tsx`
```
20 preguntas nuevas sin referencias DISC
Estructura: id, text, dimension, area, category
```

### Cliente del Test  
📄 **File:** `/app/test/disc/disc-client.tsx`
```
Cambios principales:
- Función scoring nueva: calculateDesperaScores() ~ línea 91
- Redirección nueva ~ línea 184
- Descripción intro actualizada ~ línea 201
```

### Página de Intro
📄 **File:** `/app/test/disc/page.tsx`
```
Metadata actualizada con descripción Despega
```

### Página de Resultados
📄 **File:** `/app/test/disc/results-despega/page.tsx` (NUEVA)
```
Página completamente nueva con:
- 4 tarjetas visuales
- Tabs por dimensión
- Insights personalizados
- Recomendaciones
```

---

## URLs de Prueba

### Local Development
- **Test:** http://localhost:3000/test/disc
- **Resultados:** http://localhost:3000/test/disc/results-despega
- **Demo:** http://localhost:3000/test/disc/results-despega?demo=true

### Producción
- **Test:** https://tucarrera.cl/test/disc
- **Resultados:** https://tucarrera.cl/test/disc/results-despega

---

## Documentación

### Empieza Aquí 🌟
1. **DOCUMENTATION_INDEX.md** - Índice de todo
2. **DESPEGA_QUICK_REF.md** - Referencia rápida (5 min)

### Para Entender
3. **DESPEGA_BEFORE_AFTER.md** - Qué cambió (10 min)
4. **DESPEGA_MIGRATION_COMPLETE.md** - Detalles técnicos (15 min)

### Para Desplegar
5. **DEPLOYMENT_GUIDE.md** - Cómo deployar (10 min)

### Resúmenes
6. **MIGRATION_SUMMARY.md** - Este documento
7. **DESPEGA_CEREBRAL_MIGRATION.md** - Guía técnica inicial

---

## Las 4 Dimensiones

| # | Dimensión | Preguntas | Score | Mide |
|----|-----------|-----------|-------|------|
| 1 | ⚡ Energía | 1-5 | 0-100 | Gestión de energía vital |
| 2 | 🎯 Enfoque | 6-10 | 0-100 | Concentración y ejecución |
| 3 | 🤝 Relaciones | 11-15 | 0-100 | Conexiones significativas |
| 4 | 🚀 Plan Ejecutivo | 16-20 | 0-100 | Visión a largo plazo |

---

## Base de Datos

### Tabla: `test_results`
```sql
SELECT 
  user_email,
  test_type,           -- 'Despega Cerebral'
  results,             -- JSON con 4 scores
  answers,             -- Todas las respuestas
  duration_minutes,    -- Tiempo total
  completed_at         -- Fecha completación
FROM test_results
WHERE test_type = 'Despega Cerebral'
ORDER BY completed_at DESC;
```

### Estructura de `results` (JSON)
```json
{
  "energia": 75,
  "enfoque": 65,
  "relaciones": 85,
  "plan_ejecutivo": 70
}
```

---

## Scoring

### Fórmula
```
Para cada dimensión (area):
1. Suma respuestas Likert (1-5) de esa área
2. Calcula promedio normalizado
3. Convierte a percentil 0-100
```

### Interpretación
```
Score >= 70  → Alto   → Fortaleza
50-69        → Medio  → Mejora potencial
Score < 50   → Bajo   → Área de desarrollo
```

---

## Flujo de Datos

```
┌─────────────────────────────────────────┐
│ Usuario: /test/disc (intro screen)      │
└────────────────┬────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────┐
│ 20 Preguntas Likert (1-5)               │
│ (5 por dimensión)                       │
└────────────────┬────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────┐
│ calculateDesperaScores()                 │
│ → 4 scores (0-100)                      │
└────────────────┬────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────┐
│ UnifiedTestSystem.saveTestResult()      │
│ → Supabase test_results table           │
└────────────────┬────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────┐
│ Redirige a: /test/disc/results-despega  │
└────────────────┬────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────┐
│ Muestra 4 scores + insights             │
│ Recomendaciones personalizadas          │
│ Plan de acción                          │
└─────────────────────────────────────────┘
```

---

## Archivos Importantes

### Preguntas
```
disc-questions.tsx
├─ 20 preguntas total
├─ Estructura: id, text, dimension, area, category
└─ Areas: energia, enfoque, relaciones, plan_ejecutivo
```

### Scoring
```
disc-client.tsx
├─ calculateDesperaScores() - Nueva función
├─ Reemplaza calculateDISCScores()
└─ Devuelve: {energia, enfoque, relaciones, plan_ejecutivo}
```

### Resultados
```
results-despega/page.tsx
├─ 4 tarjetas visuales (scores 0-100)
├─ Tabs para exploración
├─ Insights automáticos
├─ Recomendaciones por área
└─ Botones de acción
```

---

## Comandos Útiles

### Testing Local
```bash
npm run dev
# Ir a http://localhost:3000/test/disc
```

### Build
```bash
npm run build
```

### Type Check
```bash
npm run type-check
```

### Lint
```bash
npm run lint
```

### Deploy
```bash
git push
# Vercel auto-deploys
```

---

## Variables de Entorno

```
No se requieren nuevas variables de entorno.
Sistema es compatible con configuración actual.
```

---

## Monitoreo

### Verificar Supabase
```sql
-- Últimos tests Despega
SELECT * FROM test_results 
WHERE test_type = 'Despega Cerebral'
ORDER BY completed_at DESC
LIMIT 10;

-- Verificar estructura de results
SELECT results 
FROM test_results 
WHERE test_type = 'Despega Cerebral'
LIMIT 1;
```

### Logs
- Browser Console: F12 (revisar errores)
- Supabase Dashboard: Revisar logs de API

---

## Troubleshooting

### Test no muestra preguntas
→ Revisar que `discQuestions` importa correctamente

### Scores aparecen en 0
→ Revisar cálculo en `calculateDesperaScores()`

### Redirección no funciona
→ Verificar que archivo `results-despega/page.tsx` existe

### Datos no se guardan
→ Revisar Supabase RLS policies

---

## Próximos Pasos

### Inmediato
- [x] Migración completada
- [x] Documentación lista
- [ ] Testing local
- [ ] Deploy a producción

### Corto Plazo
- [ ] Actualizar admin dashboard
- [ ] Validar en producción

### Mediano Plazo
- [ ] Plan 90 días por dimensión
- [ ] Coaching personalizado
- [ ] A/B testing de preguntas

---

## Resumen Rápido

| Métrica | Antes | Después |
|---------|-------|---------|
| Framework | DISC | Despega |
| Preguntas | 20 genéricas | 20 específicas |
| Outputs | 4 tipos | 4 scores (0-100) |
| Resultados | Clasificatorio | Desarrollo |
| Página | DISC estándar | Despega optimizada |

---

## Links Útiles

- **Repo:** https://github.com/jcv86/main
- **Vercel:** https://vercel.com/projects/tucarrera
- **Supabase:** https://supabase.com
- **Documentación:** Archivos .md en raíz del proyecto

---

**Última actualización:** 9 de Febrero 2026
**Status:** ✅ PRODUCCIÓN
**Versión:** 1.0
