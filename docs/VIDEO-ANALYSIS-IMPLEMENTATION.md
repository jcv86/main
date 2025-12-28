# Video Analysis for Test Simulation - Implementation Guide

## Modelo Recomendado: GPT-4o (con vision capabilities)

### Por qué GPT-4o?
- **Video Processing**: Puede procesar videos extrayendo frames y analizando contenido visual + audio
- **Frame Limit**: 20 frames por request (limitación), pero ideal para videos cortos (5-10 minutos)
- **Token Efficiency**: Perfecto para análisis de tests que typically son 15-30 minutos máximo
- **Cost**: Más barato que GPT-4 Turbo y soporta streaming
- **API**: Soporte nativo para base64 encoded video frames

### Limitaciones y Workarounds
- **Límite de 20 frames**: Para videos largos, extraer frames estratégicos cada N segundos
- **Token Limit**: Usar compresión de prompts, analizar por segmentos
- **Alternativa**: Usar GPT-4o mini para análisis iniciales (más barato)

## Arquitectura Propuesta

### 1. Componentes Necesarios
- **VideoUploadComponent**: Subir video (MP4/MOV < 500MB)
- **FrameExtractorService**: Extraer frames usando FFmpeg/Blob API
- **VideoAnalysisAPI**: Endpoint que llama a GPT-4o con frames
- **QuestionMatcher**: Comparar preguntas del video con preguntas del test
- **ResultsComparator**: Generar reporte de similitud

### 2. Flujo de Datos
```
User uploads video 
  → Extract frames (cada 5-10 segundos)
  → Enviar a GPT-4o con prompt específico
  → Analizar preguntas, respuestas, tono
  → Generar preguntas similares para test
  → Almacenar en Supabase (video_analysis table)
  → Mostrar comparativa con resultados reales
```

### 3. Database Schema Needed
```sql
CREATE TABLE video_analysis (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  test_type VARCHAR(50), -- 'DISC', 'MBTI', etc
  video_url VARCHAR(500),
  extracted_questions TEXT[],
  identified_traits JSONB,
  confidence_scores JSONB,
  comparison_with_test JSONB,
  created_at TIMESTAMP
);
```

## Prompts para GPT-4o

### Prompt 1: Análisis de Test Video
```
Analyze this test video sequence and extract:
1. Questions asked (verbatim)
2. User responses (summary)
3. Behavioral indicators observed
4. Estimated DISC profile based on:
   - Speaking pace and tone
   - Response decisiveness
   - Body language (if visible)
   - Question engagement level
5. Confidence level (0-100) for profile estimation

Format: JSON with these exact keys: questions, responses, behavioral_indicators, estimated_profile, confidence
```

### Prompt 2: Question Similarity Matching
```
Compare these questions from a video test with the standard DISC test questions.
For each pair, provide:
1. Similarity score (0-100)
2. Key differences
3. Whether they measure the same trait

Video questions: [...]
Standard test questions: [...]

Format: JSON array with: video_q, standard_q, similarity_score, same_trait, differences
```

## Implementation Steps

### Step 1: Backend API for Video Analysis
- Create `/api/video-analysis` endpoint
- Accept video blob/URL
- Extract frames (20 key frames for 30min video)
- Call GPT-4o with vision
- Parse results and store in Supabase

### Step 2: Frame Extraction
- Use server-side video processing (FFmpeg.js or similar)
- Extract frames at strategic intervals
- Convert to base64 for API

### Step 3: Frontend Component
- Video upload UI (drag & drop)
- Progress tracking
- Results display with comparisons

### Step 4: Results Display
- Side-by-side comparison
- Confidence indicators
- Suggestions for test retake if needed

## Code Examples

### Extract Frames (Node.js approach)
```javascript
import ffmpeg from 'fluent-ffmpeg'
import fs from 'fs'

async function extractFrames(videoPath, frameCount = 20) {
  const frames = []
  // Implementation with ffmpeg
  return frames
}
```

### Call GPT-4o with Frames
```javascript
const response = await fetch('https://api.openai.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: 'gpt-4o',
    messages: [{
      role: 'user',
      content: [
        { type: 'text', text: 'Analyze this test video...' },
        ...base64Frames.map(f => ({
          type: 'image_url',
          image_url: { url: `data:image/jpeg;base64,${f}` }
        }))
      ]
    }],
    max_tokens: 2000
  })
})
```

## Cost Estimation
- Video (500MB) → ~5000 frames
- 20 frames seleccionados → 1 API call = ~$0.15-0.30
- Per user per video: $0.30-0.50

## Recommended Rollout
1. **MVP**: Manual upload, GPT-4o analysis, show results
2. **Phase 2**: Auto-generate similar test questions
3. **Phase 3**: Real-time video analysis during test
4. **Phase 4**: ML model fine-tuning based on comparison data
