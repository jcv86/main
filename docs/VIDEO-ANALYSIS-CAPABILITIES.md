# Sistema de Análisis de Videos - Capacidades Completas

## Ubicación
- **Ruta**: `/admin/video-analysis`
- **Acceso**: Solo administradores
- **API**: `/api/admin/video-analysis`

## Métodos de Entrada de Video

### 1. Cargar Archivo Local
- Tipos soportados: MP4, MOV, WebM, Ogg, etc.
- Tamaño máximo: Limitado por memoria del servidor
- Carga directa mediante formulario
- Vista previa del video cargado

### 2. Desde URL
- URLs directas a archivos (MP4/MOV)
- Soporte para Vimeo (con limitaciones)
- YouTube no soportado (requiere API especial)
- Descarga automática del video desde la URL

## Tipos de Análisis (5 Modos)

### 1. Contenido General
- **Descripción**: Análisis amplio del contenido del video
- **Extrae**:
  - Resumen general
  - Temas principales
  - Puntos clave
  - Duración de segmentos
  - Conclusiones relevantes
- **Ideal para**: Contenido educativo, presentaciones, tutoriales

### 2. Tests/Entrevistas
- **Descripción**: Extracción de preguntas y respuestas
- **Extrae**:
  - Lista de preguntas formuladas
  - Respuestas para cada pregunta
  - Patrones de respuesta
  - Tipo de prueba
  - Puntuación/clasificación
- **Ideal para**: Videos de tests DISC, MBTI, entrevistas
- **Especial**: Extrae Q&A de manera estructurada

### 3. Análisis de Seguridad
- **Descripción**: Detección de vulnerabilidades y riesgos
- **Extrae**:
  - Comportamientos sospechosos
  - Vulnerabilidades detectadas
  - Áreas de riesgo
  - Recomendaciones
  - Nivel de riesgo general
- **Ideal para**: Análisis de seguridad, monitoreo de instalaciones, evaluación de protocolos

### 4. Análisis de Contenido
- **Descripción**: Evaluación de calidad y relevancia
- **Extrae**:
  - Calidad de producción
  - Coherencia del mensaje
  - Claridad de comunicación
  - Elementos de engagement
  - Áreas de mejora
- **Ideal para**: Control de calidad, evaluación de materiales

### 5. Análisis de Comportamiento
- **Descripción**: Patrones de comportamiento y comunicación
- **Extrae**:
  - Patrones de comunicación
  - Lenguaje corporal
  - Tono de voz
  - Reacciones emocionales
  - Conclusiones de personalidad/intención
- **Ideal para**: Análisis psicológico, evaluación de candidatos, investigación

## Procesamiento Técnico

### Extracción de Frames
- Extrae hasta **12 frames estratégicos** del video
- Permite análisis sin procesar el video completo
- Optimiza tiempo y costo de procesamiento

### Motor de Análisis: GPT-4o Vision
- **Modelo**: OpenAI GPT-4o
- **Capacidades**:
  - Análisis visual de frames
  - Procesamiento de audio (transcripción implícita)
  - Comprensión de contexto
  - Extracción de texto e información
  - Generación de insights

### Resultado del Análisis

Cada análisis retorna:

```json
{
  "success": boolean,
  "analysisType": string,
  "duration": number (segundos),
  "keyFindings": string[],
  "questions": string[] (si aplica),
  "answers": string[] (si aplica),
  "summary": string,
  "confidence": number (0-1),
  "processedFrames": number,
  "timestamp": ISO8601 string,
  "error": string (si falla)
}
```

## Características de la Interfaz

### Panel de Configuración (Lado Izquierdo)
- Selector de tipo de análisis con descripción
- Switch entre métodos de entrada
- Upload de archivo O input de URL
- Botón "Analizar Video"
- Estado de carga con spinner

### Panel de Resultados (Lado Derecho)
- Vista previa del video (si es archivo)
- Metadata: tipo análisis, confianza, duración, frames
- Timestamp del análisis
- Resumen del contenido
- Lista de hallazgos principales
- Preguntas y respuestas (cuando aplica)

## Limitaciones y Consideraciones

### Limitaciones Actuales
- YouTube requiere descargas especiales (no implementado)
- Vimeo solo funciona con enlaces directos
- Máximo 12 frames por análisis (limitación de token de GPT-4o)
- Tamaño máximo depende de memoria disponible

### Optimizaciones Posibles
- Integrar ffmpeg para mejor extracción de frames
- Caché de análisis para videos repetidos
- Historial de análisis
- Exportación de reportes
- Análisis batch de múltiples videos

## Casos de Uso Administrativos

1. **QA de Tests**: Analizar videos de tests DISC para verificar preguntas y respuestas
2. **Análisis de Contenido**: Verificar contenido educativo de la biblioteca
3. **Seguridad**: Monitorear grabaciones de instalaciones
4. **Investigación**: Análisis profundo de comportamiento en entrevistas
5. **Auditoría**: Verificar calidad de contenido generado

## Próximos Pasos Recomendados

- Integración con almacenamiento de análisis (Supabase)
- Sistema de caché para evitar re-análisis
- Exportación de reportes en PDF
- Comparación entre análisis
- Webhooks para procesamiento automático
