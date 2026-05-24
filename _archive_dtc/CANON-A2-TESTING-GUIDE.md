# Cómo Probar el Sistema CANON A2

## Opción 1: Test Rápido (Recomendado)

Accede a **`/despega/a2-test`** - una página dedicada que te permite:

1. **Probar cada fase individualmente**
   - Click en "Test C1 → OpenAI" para probar contexto personal
   - Click en "Test A1 → OpenAI" para probar coaching post-test
   - Click en "Test C2 → OpenAI" para probar ruta + insight maestro

2. **O ejecutar prueba completa**
   - Click en "Ejecutar Prueba Completa CANON"
   - Ve todas las 3 fases en paralelo
   - Verifica que OpenAI responde correctamente en cada fase

**URL**: `/despega/a2-test`

---

## Opción 2: Test con Flujo Real (Completo)

Sigue el flujo real del usuario:

1. **Conozcámonos 1 (C1)**
   - Accede a `/despega/conozcamonos-1`
   - Completa las 7 preguntas contextuales
   - Al finalizar → OpenAI genera insights personalizados

2. **Despega Cerebral (A1)**
   - Automáticamente redirige al test A1
   - Completa las 28 preguntas
   - Al finalizar → OpenAI genera coaching validador

3. **Conozcámonos 2 (C2)**
   - Se muestra después de A1
   - Completa las 9 preguntas de ejecución
   - Al finalizar → OpenAI enriquece la ruta + genera Insight Maestro

4. **Dashboard Resultado**
   - Accede a `/despega/ciclo-completo`
   - Ve tu ruta 30/60/90 completa personalizada
   - Ve todas las fases completadas

---

## Qué Esperar en Cada Fase

### C1 → OpenAI
✅ Respuesta: Observación personal + pregunta reflexiva + recomendación
Ejemplo: "Veo que buscas liderazgo... ¿Qué te detiene actualmente? Te recomiendo..."

### A1 → OpenAI  
✅ Respuesta: Validación de tu perfil Despega Cerebral (sin juzgar) + conexión personal
Ejemplo: "Tu patrón es decisivo y orientado a resultados. Eso es una fortaleza... Ahora aprenderemos a..."

### C2 → OpenAI
✅ Respuesta: 
   - Ruta 30/60/90 generada
   - Contradicciones detectadas (si las hay)
   - Factores de riesgo/éxito identificados
   - **Insight Maestro**: Una frase épica que resume todo
   - Ejemplo: "Tu superpoder es tomar decisiones rápidas. El desarrollo es aprender a llevar a otros contigo."

---

## Verificaciones Técnicas

### Endpoint C1 → OpenAI
```
POST /api/canon/c1-openai-insights
Body: { c1Responses: {...} }
Response: { insights: "string" }
```

### Endpoint A1 → OpenAI
```
POST /api/canon/a1-openai-coaching
Body: { a1Profile: "D|I|S|C", c1Context: {...} }
Response: { coaching: "string" }
```

### Endpoint C2 → OpenAI
```
POST /api/canon/c2-openai-route-enhancement
Body: { c2Responses: {...}, a1Profile: "...", generatedRoute: {...} }
Response: { enrichedRoute: {...}, masterInsight: "string" }
```

---

## Troubleshooting

### "Error: No OpenAI API Key"
→ Verifica que `OPENAI_API_KEY` esté en variables de entorno

### "Error connecting to endpoint"
→ Asegúrate de que los endpoints existen:
- `/api/canon/c1-openai-insights`
- `/api/canon/a1-openai-coaching`
- `/api/canon/c2-openai-route-enhancement`

### "Response is taking too long"
→ Normal - OpenAI tarda 2-5 segundos por respuesta
→ Si tarda más, verifica conexión a internet

### "Las respuestas dicen DISC"
→ Los debug logs pueden ser antiguos
→ Los endpoints actuales dicen "Despega Cerebral"
→ Revisa la consola del navegador (Network tab) para ver respuestas reales

---

## Cómo Ver los Logs

1. Abre DevTools (F12 o Cmd+Opt+I)
2. Ve a "Console"
3. Verás logs como:
   - `[v0] C1: Llamando a C1→OpenAI...`
   - `[v0] Insights generados: ...`
   - `[v0] C2: Ruta enriquecida exitosamente`

---

## Resumen del Flujo

```
C1 (7 preguntas contextuales)
    ↓ [OpenAI genera insights]
    ↓
A1 (28 preguntas Despega Cerebral)
    ↓ [OpenAI genera coaching]
    ↓
C2 (9 preguntas de ejecución)
    ↓ [OpenAI enriquece ruta + Insight Maestro]
    ↓
Dashboard (Ruta 30/60/90 personalizada)
```

---

**¡LISTO! Elige una opción y comienza a probar.**
