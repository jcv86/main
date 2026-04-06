# Radar Estratégico: Sistema Avanzado de Inteligencia

## Descripción General

El Radar Estratégico es un sistema de inteligencia estratégica de 4 capas que transforma cómo los usuarios entienden el mercado laboral. Va más allá de "noticias" simples para proporcionar análisis profundo, contexto histórico, cadenas causales y mapa de impacto personal.

## Arquitectura: 4 Capas Cognitivas

### Capa 1: Lectura Base (Overview Estratégico)

**Qué proporciona:**
- Estado actual del mercado laboral
- Riesgo principal identificado
- Oportunidad principal identificada
- Narrativa dominante
- Qué vigilar ahora mismo

**Función cognitiva:** Brújula diaria. Responde "¿Cuál es la situación ahora?"

### Capa 2: Profundización Estratégica (Deep Analysis)

Cada noticia incluye:

1. **Traducción sin jerga** - Explicación clara sin tecnicismos
2. **Error del consenso** - Qué cree erróneamente la mayoría
3. **Qué descuenta el mercado** - Cómo ya los actores principales reagrupan
4. **Qué no encaja** - Excepciones a la narrativa dominante
5. **Incentivos detrás** - Quién gana si esta narrativa se amplifica
6. **Impacto temporal** - Corto (3-6m), Medio (6-18m), Largo (2+ años)
7. **Cadena causal** - Relación A → B → C con punto frágil
8. **Mapa de exposición** - Impacto en Chile / Global / Personal
9. **Evolución narrativa** - Cómo cambió la historia
10. **Narrativa zombie** - Creencias muertas aún circulantes
11. **Fuentes** - Verificabilidad académica

**Clasificación por prioridad:**
- 🔴 **Estructural** - Cambios en la arquitectura del mercado laboral (máxima profundidad)
- 🟡 **Táctico** - Cambios de corto plazo en dinámicas existentes
- 🟢 **Contextual** - Ruido útil que contextualiza pero no cambia tendencias

### Capa 3: Análisis Avanzado (En desarrollo)

- Mapa de narrativas en competencia (con probabilidades)
- Matriz Riesgo × Probabilidad
- Radar lateral (señales débiles)
- Red Team (contraargumentos estratégicos)

### Capa 4: Sistema Vivo (Continuidad)

**Estado persistente:**
- Watchlist activa (qué monitorear día a día)
- Narrativas en observación (que podrían cambiar)
- Archivo histórico de narrativas eliminadas (para pattern recognition)
- Registro de predicciones con score (accountability)

## Características Técnicas

### Lienzos Diarios

Cada solicitud de "noticia del día" genera un NUEVO lienzo con:
- Fecha completa
- Hora del análisis (timezone Chile)
- Edición (AM/PM si solicitado múltiples veces mismo día)
- Cambios intradía si edición PM

### Estructura de Datos

```typescript
interface RadarDiario {
  fecha: string
  hora: string
  timezone: 'Chile'
  edicion: 'AM' | 'PM'
  lecturaBas: StrategicInsight    // Capa 1
  noticias: NoticiaProfunda[]     // Capa 2
  // Capa 3 - En desarrollo
  // Capa 4 - Sistema vivo
  watchlist: string[]
  narrativasEnObservacion: string[]
}
```

## Uso en A4: "La Realidad - Ejecución y Contexto"

En A4, el usuario accede al tab "Radar" y obtiene:

1. **Lectura Estratégica del Día** - En 30 segundos entiende qué está pasando
2. **3 Categorías de Noticias** - Puede profundizar según su interés
3. **Watchlist Activa** - Qué monitorear mañana
4. **Narrativas en Observación** - Patrones a seguir

## Casos de Uso

### Usuario Junior (0-5 años experiencia)

- Lee Lectura Base → Entiende contexto
- Enfoque en noticias 🟢 Contextual y 🟡 Táctico
- Pregunta: "¿Qué habilidades necesito?"

### Usuario Senior (5-15 años)

- Lee todos los niveles
- Enfoque en 🔴 Estructural
- Pregunta: "¿Cómo cambio mi estrategia?"

### Ejecutivo (15+ años)

- Lee Red Team y narrativas en competencia
- Enfoque en cadenas causales y puntos frágiles
- Pregunta: "¿Dónde está la disrupción real?"

## Extensión Futura: Sistema Predictivo

Versión 2.0 incluirá:
- Registro de predicciones del Radar (score histórico)
- Análisis de qué predicciones acertaron/fallaron
- Modelo de "confianza narrativa" mejorado
- Integración con datos de LinkedIn (oferta laboral), CMF (salarios), etc.

## Diferenciación vs Competencia

| Aspecto | Tradicional | Radar Estratégico |
|--------|-----------|------------------|
| **Qué da** | Títulos + resumen | Análisis + incentivos + impacto |
| **Propósito** | Informar | Entrenar pensamiento analítico |
| **Enfoque temporal** | Hoy | Hoy + causas + futuro |
| **Acción esperada** | Leer | Analizar + Decidir |
| **Profundidad** | 1 nivel | 4 capas |

## Resultado para Usuario

El usuario accede a A4 y en la tab "Radar Estratégico" obtiene una **mesa de estrategia profesional**, no un feed de noticias. Desarrolla pensamiento analítico real sobre cómo la estructura del mercado laboral evoluciona y qué significa para su carrera.
