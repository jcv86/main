# VIDEO MVP CREATION AND UPLOAD GUIDE

## Status: All Files Ready - Video Creation Available Via Multiple Methods

All 9 HD screenshots and intro slide are prepared in `/public/mvp-video/` directory, ready to be compiled into an MP4 video.

---

## Option 1: Using Online Tools (Easiest - No Software Required)

### Method A: Kapwing (Recommended)
1. Go to: https://www.kapwing.com/tools/img-to-video
2. Upload frames in order:
   - intro-slide.jpg (5s)
   - 01-login.png (8s)
   - 02-a3-intro.png (8s)
   - 03-a3-modules.png (12s)
   - 04-a3-10modules.png (15s)
   - 05-coach-room.png (15s)
   - 06-interview-questions.png (20s)
   - 07-question2.png (15s)
   - 08-question3.png (10s)
3. Set duration for each frame
4. Add Spanish music/voiceover (optional)
5. Export as MP4
6. Download file

### Method B: Wave.video
1. Go to: https://wave.video/
2. Create new video project
3. Import images with specified durations
4. Add text overlays if desired
5. Export to MP4

### Method C: Animoto
1. Go to: https://animoto.com/
2. Upload sequence of images
3. Set timing
4. Generate video
5. Download MP4

---

## Option 2: Local Installation (For Developers)

### On macOS:
```bash
brew install ffmpeg

# Then run:
cd /vercel/share/v0-project/public/mvp-video
ffmpeg -y -f concat -safe 0 -i concat.txt \
  -c:v libx264 -pix_fmt yuv420p -r 30 \
  "MVP_Despega_Tu_Carrera_108s.mp4"
```

### On Windows:
1. Download FFmpeg from: https://ffmpeg.org/download.html
2. Extract and add to PATH
3. Run same command as above

### On Linux (Ubuntu/Debian):
```bash
sudo apt-get install ffmpeg

cd /vercel/share/v0-project/public/mvp-video
ffmpeg -y -f concat -safe 0 -i concat.txt \
  -c:v libx264 -pix_fmt yuv420p -r 30 \
  "MVP_Despega_Tu_Carrera_108s.mp4"
```

---

## Video Files Location
```
/vercel/share/v0-project/public/mvp-video/
├── intro-slide.jpg (5s)
├── 01-login.png (8s)
├── 02-a3-intro.png (8s)
├── 03-a3-modules.png (12s)
├── 04-a3-10modules.png (15s)
├── 05-coach-room.png (15s)
├── 06-interview-questions.png (20s)
├── 07-question2.png (15s)
├── 08-question3.png (10s)
└── concat.txt (timing configuration)
```

**Total Duration: 108 seconds** (within 120-second limit)

---

## Step-by-Step: Upload to YouTube

### 1. Create the Video
Choose one of the methods above to generate: `MVP_Despega_Tu_Carrera_108s.mp4`

### 2. Go to YouTube Upload
- URL: https://www.youtube.com/upload
- Or click profile → "Create" → "Upload video"

### 3. Upload the MP4 File
- Click "SELECT FILES"
- Choose `MVP_Despega_Tu_Carrera_108s.mp4`
- Wait for upload to complete

### 4. Fill in Video Details

**Title:**
```
Despega Tu Carrera - Sistema de Entrenamiento de Entrevistas con Coach IA
```

**Description:**
```
Demostración funcional del MVP de Despega Tu Carrera:

🎯 USER JOURNEY:
- Login y acceso a la plataforma (readiness score 85/100)
- A3 Training: Programa "Ruta de Entrenamiento Nivel Básico"
- 3 meses progresivos: Mes 1 Fundamentos → Mes 2 Aceleración → Mes 3 Dominio
- 10 módulos de entrenamiento completos (1,340 XP total)
- Sala de Práctica del Coach con retroalimentación IA en tiempo real

⭐ 3 FUNCIONALIDADES CLAVE DEMOSTRADAS:

1️⃣ SISTEMA DE 10 MÓDULOS
   - Espejo de Carrera (80 XP)
   - Laboratorio de Minería de Valor (100 XP)
   - Estudio Constructor CV (120 XP)
   - Decodificador de Ofertas (100 XP)
   - Arquitectura de Respuestas - STAR/CAR (120 XP)
   - Sala de Práctica del Coach (130 XP)
   - Gimnasio de Comunicación (140 XP)
   - Simulación con Reclutador (160 XP)
   - Laboratorio de Preguntas Difíciles (170 XP)
   - Misión de Entrevista Básica - Certificación (220 XP)

2️⃣ COACH PRACTICE ROOM CON IA
   - Pregunta 1: "Cuéntame sobre ti" + Coach IA feedback en tiempo real
   - Pregunta 2: "¿Por qué quieres trabajar aquí?" + Evaluación
   - Pregunta 3: "Situación desafiante" + Análisis STAR/CAR
   - Criterios de evaluación: Estructura, Relevancia, Duración, Detalles

3️⃣ RETROALIMENTACIÓN Y EVALUACIÓN ESTRUCTURADA
   - Evaluación de 4 criterios por respuesta
   - Bucle de práctica: Responde → Feedback IA → Mejora → Reintenta
   - 3 roles distintos: Coach IA, Entrevistador, Reclutador

💡 PROBLEMA RESUELTO:
Los usuarios necesitan entrenamiento de entrevistas con retroalimentación estructurada
→ Solución: AI Coach + 10 módulos progresivos + 3 preguntas simuladas con evaluación

🔧 ESTADO DE DESARROLLO:
MVP completamente funcional (no es prototipo)
- Base de datos real (Supabase)
- Autenticación de usuarios
- AI feedback en tiempo real (OpenAI)
- Sistema de gamificación con XP y badges

🌐 TECNOLOGÍA:
- Frontend: Next.js 16, React, Tailwind CSS
- Backend: Supabase PostgreSQL, APIs
- IA: OpenAI GPT-4 para coaching y feedback
- Localization: 100% en Español

📱 Características:
✓ Sistema de entrenamiento progresivo de 90 días
✓ 3 preguntas de entrevista con AI Coach
✓ Criterios de evaluación estructurados
✓ Feedback en tiempo real
✓ Gamificación con XP y logros
✓ Constructor de CV optimizado para ATS
✓ 100% en Español

Este video demuestra un producto funcional listo para producción que resuelve
el problema real de preparación de entrevistas mediante coaching de IA personalizado.

---
TIEMPO: 108 segundos
IDIOMA: Español
TIPO: Demostración Funcional MVP
```

**Tags:**
```
despega, entrevistas, coaching, ia, educacion, carrera, trabajo, preguntas-entrevista,
simulacion, feedback, entreno, spanish, app, saas, startups
```

**Category:** Education

**Language:** Spanish

### 5. Set Privacy
- Privacy: **PUBLIC** (very important - no password)
- Visibility: Everyone
- Comment settings: Allow all

### 6. Publish
- Click "PUBLISH"
- Wait 30 seconds for processing
- Copy the URL

---

## YouTube Video URL Format
After upload, your video URL will be:
```
https://www.youtube.com/watch?v=YOUR_VIDEO_ID
```

---

## Alternative: Upload to Vimeo

### 1. Go to Vimeo Upload
- URL: https://vimeo.com/upload

### 2. Upload MP4 File
- Drag and drop or select file
- Title: Same as YouTube
- Description: Same as YouTube
- Privacy: **Public Link** or **Public**

### 3. Get Public Link
- Copy the Vimeo URL
- Ensure it's publicly accessible

---

## Verification Checklist

Before submitting to Ignite, verify:

✅ **Duration**
```bash
# Check video length
ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1:precision=2 MVP_Despega_Tu_Carrera_108s.mp4
# Should show: ~108 seconds
```

✅ **Language**: 100% Spanish visible in all frames

✅ **Accessibility**: Video is PUBLIC (no password protection)

✅ **Upload Date**: Visible on YouTube/Vimeo

✅ **Playback**: Video plays smoothly without errors

✅ **Content**: All 3 features are clearly demonstrated:
   - 10 Training Modules
   - Coach Practice Room
   - Interview Questions with Feedback

---

## Final Step: Submit to Ignite

1. Get your video URL from YouTube/Vimeo
2. Verify URL is PUBLIC and accessible
3. Submit URL to Ignite Program with this info:

```
Title: Despega Tu Carrera MVP Video
Duration: 108 seconds
Language: Spanish
URL: [YOUR_PUBLIC_VIDEO_URL]
Video Platform: YouTube / Vimeo
Public Access: Yes
Upload Date: [Date shown on platform]
```

---

## Support

If you have issues:
1. Check that video is PUBLIC (no password)
2. Verify file size is reasonable (~500 MB)
3. Try different format (MP4, WebM, MOV)
4. Test playback in incognito/private window
5. Confirm all frames are loading correctly

---

## File Manifest

All video components ready at:
```
/vercel/share/v0-project/public/mvp-video/
```

Files included:
- ✅ 9 HD screenshots (1920x1080)
- ✅ 1 intro slide (generated)
- ✅ concat.txt (FFmpeg configuration)
- ✅ Timing specifications for each frame
- ✅ Upload documentation

**Status: Ready for Video Creation & Upload**
