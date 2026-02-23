# A4 Radar Estratégico - Documentación Técnica

## Visión General

El **Radar Estratégico** es un motor cognitivo estructurado que transforma noticias en inteligencia estratégica. No es un feed tradicional, sino una herramienta de pensamiento estructurado que enseña a analizar el mundo en capas.

**Principio Rector:** Transformar "¿Qué pasó?" en "¿Qué significa realmente? ¿Qué está cambiando?"

---

## Arquitectura: 7 Capas Obligatorias

Cada noticia analizada en el Radar tiene **7 capas de profundidad cognitiva:**

### Capa 1: Tesis
La proposición central que sustenta la noticia. La respuesta a "¿Por qué importa?"

### Capa 2: Delta vs Ayer
¿Qué cambió desde ayer? Entrenar pensamiento comparativo, no lineal.

### Capa 3: Nivel de Energía
- **Alta**: Eventos aceleradores que cambian narrativas rápidamente
- **Confirmación**: Validación de narrativas previas
- **Contexto**: Relleno educativo, sin cambio inmediato

### Capa 4: Qué Descuenta el Mercado
Las expectativas implícitas que el mercado ya tiene precificadas. Lo que el mercado YA sabe.

### Capa 5: Consenso y Tensión Narrativa
- **Consenso**: Nivel de acuerdo sobre la interpretación
- **Tensión**: Dónde están las colisiones interpretativas

### Capa 6: Ritmo Narrativo
- **Acelerando**: Ganando momentum, narrativa expandiendo
- **Estabilizado**: Narrativa confirmada, en equilibrio
- **Perdiendo fuerza**: Narrativa debilitándose, perderá relevancia

### Capa 7: Impacto Plazo
- **Corto**: Efecto en semanas
- **Mediano**: Efecto en meses
- **Largo**: Efecto en años, cambios estructurales

---

## Modelos del Radar

### 1. Tesis del Día
Documento editorial maestro que sintetiza el día desde perspectiva estratégica (5-6 líneas máximo).

**Tabla:** `despega_radar_tesis_dia`

```sql
- fecha: DATE
- tesis_estrategica: TEXT (síntesis central)
- delta_estrategico: TEXT (cambio vs ayer)
- nivel_energía: VARCHAR (Alta/Confirmación/Contexto)
- que_descuento_mercado: TEXT
- consensus_score: FLOAT (0-1, nivel acuerdo)
- tension_narrativa: TEXT (dónde están las colisiones)
- ritmo_narrativo: VARCHAR (Acelerando/Estabilizado/Perdiendo)
- impacto_plazo: VARCHAR (Corto/Mediano/Largo)
```

### 2. Noticias del Radar
Cada noticia tiene las 7 capas asignadas.

**Tabla:** `despega_radar_noticias`

```sql
- tesis_dia_id: FK a tesis del día
- titulo, descripcion, fuente, url
- capa_1_tesis ... capa_7_impacto_plazo
- fecha_publicacion
```

### 3. Evolución Narrativa
Mapeo de cómo una narrativa evoluciona:

**Tabla:** `despega_radar_narrativa`

```sql
- noticia_id: FK
- tipo_evolucion: VARCHAR (Continua/Cambia narrativa/Ruido pasajero/Inicia tendencia)
- perspectiva_anterior: TEXT
- perspectiva_nueva: TEXT
```

### 4. Radar Comparativo
Mapa de cobertura mediática vs relevancia estructural real.

**Tabla:** `despega_radar_comparativo`

```sql
- tema: TEXT
- cobertura_mediatica: FLOAT (0-100, ¿cuánto hablan?)
- relevancia_estructural: FLOAT (0-100, ¿qué tan importante es realmente?)
- gap_interpretacion: FLOAT (cobertura - relevancia)
```

**Uso:** Identificar qué el mercado está sobre/subcubriendo.

### 5. Weak Signals
Señales débiles con potencial futuro de activación.

**Tabla:** `despega_radar_weak_signals`

```sql
- senal: TEXT
- magnitud_potencial: FLOAT (0-1)
- timeframe_activacion: VARCHAR (Inmediato/Corto/Mediano/Largo)
- probabilidad_activacion: FLOAT (0-1)
- impacto_potencial: TEXT
```

### 6. Engagement
Tracking de cómo los usuarios interactúan con el Radar.

**Tabla:** `despega_radar_engagement`

```sql
- user_id: UUID
- noticia_id: FK
- tipo_interaccion: VARCHAR (read/saved/shared/commented/analyzed)
- tiempo_lectura_segundos: INT
- profundidad_lectura: VARCHAR (Titulo/Resumen/Completo)
```

---

## UX/UI

### Página Principal: `/despega/a4/radar`

**Componente:** `RadarEstrategico`

**Secciones:**

1. **Lectura Estratégica del Día** (Top)
   - Tesis maestra
   - 5 líneas máximo
   - Metadata: nivel, ritmo, impacto, consenso
   - Qué descuenta el mercado
   - Tensión narrativa

2. **Señales del Radar** (Noticias)
   - Grid de tarjetas
   - Cada tarjeta muestra: título, fuente, nivel, ritmo, impacto
   - Click → Modal con 7 capas completas

3. **Tabs de Filtrado**
   - Todas
   - Alta Energía
   - Acelerando
   - Weak Signals

**Diseño:** Tema oscuro profesional (slate-900), claridad visual máxima, tipografía clara, jerarquía fuerte.

---

## API Endpoints

### GET `/rest/radar-estrategico-data`

Retorna:
```json
{
  "tesisDia": { /* Tesis del día completa */ },
  "noticias": [ /* Array de noticias con 7 capas */ ],
  "weakSignals": [ /* Array de weak signals */ ]
}
```

---

## Tonalidad Editorial

**Distribución:**
- 70% Estratega calmado (análisis estructurado)
- 20% Mentor cognitivo (enseña a pensar)
- 10% Analista técnico (datos, métricas)

**Principios:**
- Claridad > profundidad innecesaria
- Movimiento > acumulación
- Narrativa > titulares
- Calma > reacción
- Estructura > ruido

---

## Roadmap Futuro (No MVP)

- [ ] Personalización por DISC profile
- [ ] Integración con modelos de lenguaje para generación automática de capas
- [ ] Weak signal detection automática
- [ ] Exportar análisis a formatos diversos
- [ ] Integraciones con Reuters, Bloomberg, FT
- [ ] Análisis histórico (cómo evolucionó una narrativa en 6 meses)
- [ ] Collaborative radar (múltiples analistas anotando)
- [ ] Machine learning para pattern detection

---

## Scripts de Inicialización

**Crear tablas:**
```bash
npm run sql:exec scripts/04-create-a4-radar-estrategico.sql
```

**Seed inicial:**
Incluido en el script SQL.

---

## Status: MVP Fase 1 ✅

- [x] Tablas Supabase creadas
- [x] Componente viewer React
- [x] API endpoint de datos
- [x] Página principal
- [x] Integración en dashboard A4
- [ ] Seed data de ejemplo
- [ ] Sistema de actualización diaria (scheduled tasks)
- [ ] Admin panel para crear tesis del día
