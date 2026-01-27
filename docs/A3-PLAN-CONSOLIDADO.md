# A3 ENTREVISTAS GUIADAS - PLAN COMPLETO

## RESUMEN EJECUTIVO

Sistema integrado de entrevistas guiadas con 4 componentes principales:
- **Dashboard de Progreso 30-60-90** - Tracking visual del desarrollo
- **Feedback con IA** - Análisis automático de respuestas  
- **Banco de Videos** - Ejemplos y educación
- **Empleadores API** - Compartir scores y matching

---

## FASE 1: DASHBOARD DE PROGRESO (30-60-90)

### Estructura SQL (Ya creada en a3-progreso-dashboard-schema.sql)
```
- a3_progreso_ciclos: Ciclos 30, 60, 90
- a3_metrics_entrevista: Scores de cada entrevista
- a3_progreso_puntos: XP + achievements
```

### Componente Visual
```tsx
// /components/a3-dashboard-progreso.tsx
- Ciclo actual (30/60/90)
- Progreso visual: 0-100%
- Últimas 3 entrevistas (cards)
- Score promedio: 0-100
- Tiempo promedio de respuesta
- Badges ganados
```

---

## FASE 2: FEEDBACK CON IA (OpenAI/Groq)

### Tipos de Feedback
1. **Contenido** - ¿Qué se respondió?
2. **Estructura** - ¿Cómo se organizó?
3. **Tono** - ¿Cómo se presentó?
4. **Timing** - ¿Cuánto tardó?

### Prompt de IA
```
Eres un coach de entrevistas profesional. Analiza esta respuesta y da feedback breve pero accionable.
Perfil del usuario: {perfil_DISC}
Pregunta: {pregunta}
Respuesta: {respuesta_usuario}
Tiempo: {segundos}

Estructura de respuesta:
{
  "score": 0-100,
  "puntos_fuertes": ["punto1", "punto2"],
  "mejorar": ["area1", "area2"],
  "sugerencia_accion": "Haz esto..."
}
```

---

## FASE 3: BANCO DE VIDEOS

### Estructura
```
- Video introductorio: "Cómo tener una buena entrevista" (3 min)
- Videos por perfil DISC (A/B/C/D): "Entrevista de tipo A" (5 min)
- Ejemplos de buenas respuestas (2 min c/u)
- Errores comunes (3 min)
```

### Integración
```tsx
// /components/a3-video-banco.tsx
<Tabs defaultValue="intro">
  <TabPane value="intro" label="Introducción">
    <Video src="/videos/intro.mp4" />
  </TabPane>
  <TabPane value={perfil} label={`Tu tipo: ${perfil}`}>
    <Video src={`/videos/perfil-${perfil}.mp4`} />
  </TabPane>
</Tabs>
```

---

## FASE 4: EMPLEADORES API

### Endpoints
```
GET /api/a3/perfil-publico/{user_id}
  -> Retorna: tipo_perfil, promedio_entrevistas, skills

POST /api/a3/compartir-score
  -> Genera token compartible

GET /api/a3/empresas/matches
  -> Retorna: empleadores ideales por perfil
```

### Schema
```sql
CREATE TABLE a3_empleador_integraciones (
  id UUID,
  employer_name VARCHAR,
  api_key VARCHAR,
  webhook_url VARCHAR,
  created_at TIMESTAMP
);
```

---

## IMPLEMENTACIÓN PASO A PASO

### Sprint 1: Core (Ya completado)
- [x] Schema de entrevistas guiadas
- [x] Lógica de preguntas por perfil
- [x] Componente entrevista guiada

### Sprint 2: Progreso + IA (PRÓXIMO)
- [ ] Ejecutar a3-progreso-dashboard-schema.sql
- [ ] Crear /lib/a3-progreso-logic.ts (cálculos)
- [ ] Crear /components/a3-dashboard-progreso.tsx (visual)
- [ ] Integrar IA en /app/api/a3/feedback/route.ts

### Sprint 3: Videos + Empleadores (DESPUÉS)
- [ ] Crear /components/a3-video-banco.tsx
- [ ] Setup videos en /public/videos/
- [ ] APIs de empleadores: /api/a3/perfil-publico, /api/a3/compartir

---

## COMANDOS A EJECUTAR

```bash
# 1. Crear tablas de progreso
psql < scripts/a3-progreso-dashboard-schema.sql

# 2. Crear API de feedback (una vez tengamos código)
npm run deploy
```

---

## PRÓXIMO: ¿QUÉ CREAMOS?

Opciones:
1. **Dashboard de Progreso** - Visualización de ciclos 30-60-90
2. **Feedback con IA** - Integración OpenAI/Groq
3. **Videos** - Banco educativo
4. **Empleadores** - API de matching

¿Cuál prefieres primero?
