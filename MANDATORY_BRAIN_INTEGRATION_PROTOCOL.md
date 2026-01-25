# 🧠 PROTOCOLO OBLIGATORIO: CEREBRO + TESTS + BIBLIOTECA

## Estado Actual: ✅ COMPLETAMENTE ACTIVADO

Este documento establece que **EL FLUJO HÍBRIDO CEREBRO + TESTS + BIBLIOTECA SIEMPRE SE DEBE CUMPLIR** en el sistema.

---

## 1. VALIDACIÓN DEL SISTEMA ACTUAL

### Tests Integrados (6/6 - 100%):
```
✅ DISC - TestInsights implementado
✅ MBTI - TestInsights implementado  
✅ Big Five - MultiTestInsights/TestInsights implementado
✅ Emotional Intelligence - TestInsights implementado (NUEVO)
✅ RIASEC - TestInsights implementado (NUEVO)
✅ Soft Skills - TestInsights implementado (ACTUALIZADO)
```

### Componente Core:
```
/components/test-insights.tsx
├─ Llama: /api/post-test-insights
├─ Integra: OpenAI + Cerebro + Biblioteca
└─ Retorna: Insights Híbridos Personalizados
```

---

## 2. FLUJO OBLIGATORIO (SIEMPRE OCURRE)

### A. En Cada Página de Resultados:

```
1. Usuario completa test
   ↓
2. Resultados se guardan en BD
   ↓
3. Se renderiza TabsContent "insights-hibridos"
   ↓
4. Se importa <TestInsights /> (OBLIGATORIO)
   ↓
5. TestInsights llama /api/post-test-insights
   ↓
6. API ejecuta análisis híbrido:
   - OpenAI: Análisis profesional
   - Cerebro: Búsqueda en conocimiento
   - Biblioteca: Recomendaciones de libros
   ↓
7. Merge inteligente de insights
   ↓
8. Usuario ve análisis 100% personalizado
```

### B. Props OBLIGATORIOS para TestInsights:

```tsx
<TestInsights
  testType="DISC|MBTI|Big Five|Emotional Intelligence|RIASEC|Soft Skills"
  testResults={resultados}  // Del test completado
  userId={user?.id}          // Para personalización
/>
```

---

## 3. API /api/post-test-insights - CONTRATO

### Request:
```json
{
  "testType": "string",
  "results": "object",
  "testResponses": "object",
  "userId": "string"
}
```

### Response:
```json
{
  "insights": [{
    "source": "openai|cerebro|hybrid",
    "category": "string",
    "title": "string",
    "description": "string",
    "confidence": 0.95,
    "priority": "high|medium|low",
    "actionableSteps": ["string"]
  }],
  "recommendations": [{
    "type": "book|resource|action",
    "title": "string",
    "source": "biblioteca",
    "relevance": 0.9
  }],
  "developmentPlan": {
    "timeframe": "3-6 months",
    "steps": []
  },
  "metadata": {
    "totalInsights": 12,
    "cerebroInsightsCount": 5,
    "processingTime": 1250
  }
}
```

---

## 4. CHECKLIST PARA NUEVOS TESTS

Si se agrega un nuevo tipo de test en el futuro, MUST cumpla:

- [ ] Crear archivo: `/app/test/{testname}/results/page.tsx`
- [ ] OBLIGATORIO: Importar `TestInsights` del componente
- [ ] OBLIGATORIO: Agregar TabsContent con `value="insights-hibridos"`
- [ ] OBLIGATORIO: Renderizar `<TestInsights testType="..." testResults={...} userId={...} />`
- [ ] Validar que API retorna insights híbridos
- [ ] Prueba en dev: Completar test → Ver pestaña "Insights IA" → Verificar análisis personalizado

---

## 5. PUNTOS DE INTEGRACIÓN CRÍTICOS

### Archivo: `/components/test-insights.tsx`
- **Línea 48**: Fetch a `/api/post-test-insights` (NON-OPTIONAL)
- **Línea 71-74**: Actualiza estado con insights + recomendaciones + plan
- **Línea 111**: Filtra insights del cerebro
- **Línea 150**: Badge que muestra fuente "cerebro"

### Archivo: `/app/api/post-test-insights/route.ts`
- **CORE**: Orquesta OpenAI + Enhanced Platform Brain + Biblioteca
- **Objetivo**: Retornar insights personalizados 100%
- **Garantía**: Siempre hay mezc lógica de 3 fuentes

### Tests Dependientes:
- `/app/test/*/results/page.tsx` (6 archivos)
- TODOS importan TestInsights
- TODOS tienen tab "insights-hibridos"

---

## 6. MÉTRICAS DE CUMPLIMIENTO

```
Métrica                     | Target | Estado
---------------------------|--------|--------
Tests con TestInsights      | 6/6    | ✅ 100%
Importes correctos          | 6/6    | ✅ 100%
Tabs "insights-hibridos"    | 6/6    | ✅ 100%
API conectada               | 1/1    | ✅ 100%
Cerebro integrado           | ✅     | ✅ Activo
Biblioteca accesible        | ✅     | ✅ 145+ libros
```

---

## 7. VALIDACIÓN RÁPIDA

Para verificar que TODO está funcionando:

```bash
# 1. Dev server
npm run dev

# 2. Completar un test
# Ir a http://localhost:3000/test/disc

# 3. Ver resultados
# Debe mostrar 6 tabs incluyendo "Insights IA"

# 4. Hacer clic en "Insights IA"
# Debe cargar con spinner "Analizando con Cerebro..."
# Luego mostrar:
# - Badges de "Insights Híbridos" + "del Cerebro"
# - Insights Prioritarios
# - Recomendaciones de Libros
# - Plan de Desarrollo Personalizado

# 5. Ver en console (DevTools)
# [v0] Fetching hybrid insights for DISC
# [v0] Received hybrid insights: {...}
```

---

## 8. PROHIBICIONES

❌ NO hacer:
- Ignorar TestInsights en nuevos tests
- Usar análisis estático sin cerebro
- Omitir la pestaña "insights-hibridos"
- Modificar API sin validar que retorna híbridos
- Cambiar props obligatorios de TestInsights

---

## 9. RESPONSABLE DE MANTENIMIENTO

Este protocolo es **INMUTABLE**. El sistema SIEMPRE debe:

1. ✅ Llamar TestInsights en resultados
2. ✅ Usar /api/post-test-insights
3. ✅ Integrar Cerebro + Biblioteca
4. ✅ Retornar insights personalizados

**Cualquier cambio futuro debe respetar este flujo obligatorio.**

---

**Documentación generada**: 2026-01-25
**Versión**: 1.0 - PROTOCOLO PERMANENTE
**Estado**: ✅ ACTIVO Y FUNCIONAL
