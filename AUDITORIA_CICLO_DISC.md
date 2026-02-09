## AUDITORÍA COMPLETA: CICLO DEL TEST DESPEGA CEREBRAL

### 1. ENTRADA DEL USUARIO

**Ruta:** `/despega/onboarding`

**Lo que ve:**
- Portada profesional: "Descubre tu Perfil DISC"
- Descripción: "Despega Cerebral - Test de Personalidad Profesional"
- 5 pasos explicados:
  - 28 preguntas de 4 palabras cada una
  - Elige la palabra MÁS parecida a ti
  - Elige la palabra MENOS parecida a ti
  - Tiempo estimado: 10 minutos
  - Resultados instantáneos
- Explicación de 4 estilos DISC:
  - D (Dominio) - Decisivo, orientado a resultados
  - I (Influencia) - Carismático, motivador
  - S (Estabilidad) - Calmado, leal
  - C (Conscientia) - Analítico, preciso
- Botón "Comenzar Test"

---

### 2. FLUJO DEL TEST

**Estructura:**
- **28 preguntas** profesionales tipo LiderDISC
- Cada pregunta tiene **4 opciones** (D, I, S, C)
- Interfaz dividida en **2 secciones:**
  - Arriba: Selecciona MÁS parecida (verde)
  - Abajo: Selecciona MENOS parecida (rojo)

**Ejemplo de pregunta:**
```
Pregunta 1 de 28
[Decisivo] [Entusiasta] [Tranquilo] [Cuidadoso]
---separador---
[Decisivo] [Entusiasta] [Tranquilo] [Cuidadoso]
```

**Características del flujo:**
- Indicador de progreso (ej: 50%)
- Botones Anterior/Siguiente
- Última pregunta muestra "Ver Resultados"
- Validación: No puedes proceder sin seleccionar ambas opciones

---

### 3. CÁLCULO DE PUNTUACIONES

**Algoritmo (Scoring):**

```
Para cada pregunta:
- Si seleccionas opción como "MÁS parecida" → +1 punto para ese tipo (D/I/S/C)
- Si seleccionas opción como "MENOS parecida" → -1 punto para ese tipo

Rango por dimensión: -28 a +28
Normalización a percentil: ((score + 28) / 56) * 100
Resultado final: 0-100% por dimensión
```

**Ejemplo:**
```
Respuestas brutas:
D: 15 votos positivos, 8 votos negativos = +7 puntos
I: 10 votos positivos, 12 votos negativos = -2 puntos
S: 14 votos positivos, 6 votos negativos = +8 puntos
C: 8 votos positivos, 20 votos negativos = -12 puntos

Normalización:
D: ((7 + 28) / 56) * 100 = 62.5% → 63%
I: ((-2 + 28) / 56) * 100 = 46.4% → 46%
S: ((8 + 28) / 56) * 100 = 64.3% → 64%
C: ((-12 + 28) / 56) * 100 = 28.6% → 29%
```

---

### 4. DATOS GUARDADOS EN BD

**Tabla: `unified_test_results`**

```json
{
  "user_email": "usuario@example.com",
  "user_id": "uuid-del-usuario",
  "test_type": "despega_cerebral",
  "test_results": {
    "D": 63,
    "I": 46,
    "S": 64,
    "C": 29
  },
  "created_at": "2026-02-09T14:30:00Z"
}
```

**Información guardada:**
- Email del usuario
- ID único del usuario
- Tipo de test
- 4 scores normalizados (0-100%)
- Timestamp de creación

---

### 5. QUÉ RECIBE EL USUARIO - RESULTADOS INMEDIATOS

**Pantalla de Resultados (5 secciones):**

#### A. PORTADA PROFESIONAL
```
INFORME DESPEGA CEREBRAL
Perfil DISC Profesional

Usuario: usuario@example.com
Fecha: 9/02/2026
```

#### B. TABLA DE PUNTUACIONES
```
D - Dominio (Orange)
Score: 63% ████████░

I - Influencia (Purple)
Score: 46% ██████░░

S - Estabilidad (Blue)
Score: 64% ████████░

C - Consciencia (Green)
Score: 29% ███░░░░░
```

#### C. ANÁLISIS DE FORMA NATURAL DE ACTUAR
Texto personalizado según perfil dominante (S en este caso):
```
"Actúas buscando estabilidad y apoyo continuo. Eres confiable, 
consistente y apoyas a otros sin necesidad de reconocimiento. 
Tu fortaleza es la constancia."
```

Lo que puede incomodarte:
```
"Cambios abruptos, presión excesiva, ambientes caóticos. 
Te incomoda la incertidumbre y la falta de estructura."
```

#### D. TUS FORTALEZAS VISIBLES
**Lo que sabes hacer bien:**
- Mantener consistencia y ser un apoyo confiable
- Generar confianza y seguridad en el equipo
- Apoyar a otros sin buscar reconocimiento

**Así colaboras con otros:**
- Eres el pilar de estabilidad del equipo
- Creas un ambiente positivo y motivador
- Escuchas y entiendes las necesidades de otros

#### E. OPORTUNIDADES DE CRECIMIENTO
**Para desarrollarte:**
- Aprende a tomar riesgos calculados
- Fortalece tu capacidad analítica

**Dónde puedes brillar:**
- Roles de soporte, coordinación y mentoring
- Entornos estables con procesos definidos

---

### 6. RECOMENDACIONES PERSONALIZADAS

**Basadas en perfil DISC + Brain + Biblioteca**

Libros recomendados para perfil "S - Estabilidad":
```
1. "El Poder del Hábito" - Charles Duhigg
   - Dificultad: Intermedio
   - Tiempo: 6 horas
   - Rating: ⭐ 4.8
   - "Perfecto para fortalecer tu estabilidad mediante hábitos"

2. "Liderazgo Servicial" - James C. Hunter
   - Dificultad: Intermedio
   - Tiempo: 5 horas
   - Rating: ⭐ 4.6
   - "Alinea perfectamente con tu naturaleza de servicio"
   
[más libros recomendados...]
```

---

### 7. WHAT USER SEES IN DASHBOARD

**Ruta:** `/dashboard`

**Tabs:**
1. **Visión General**
   - Score DISC (D/I/S/C)
   - Perfil dominante
   - Progress bar (20% - Pillar A1 Cerebral completado)

2. **Despega Cerebral**
   - Gráfica con 4 barras de colores (D/I/S/C)
   - Descripción del perfil
   - Matriz de comportamiento

3. **Biblioteca**
   - Libros recomendados
   - Covers de libros
   - Dificultad y tiempo de lectura

**Si no hay datos:**
- Empty state: "Completa tu test DISC para ver tu perfil"
- Botón: "Comenzar Test"

---

### 8. FLUJO COMPLETO (Timeline)

```
1. Usuario accede /despega/onboarding
   ↓
2. Ve intro con explicación de DISC (4 estilos)
   ↓
3. Responde 28 preguntas (MÁS/MENOS parecida)
   ↓
4. Sistema calcula scores (raw -28 a +28, normaliza a 0-100%)
   ↓
5. Guarda en BD: unified_test_results
   ↓
6. Muestra resultados inmediatos (portada + 5 secciones)
   ↓
7. Genera recomendaciones de libros (Brain + Biblioteca)
   ↓
8. Botón: "Ir a Mi Dashboard"
   ↓
9. Usuario ve dashboard con DISC scores, progreso y libros
```

---

### 9. PROBLEMAS ACTUALES

❌ **Dashboard vacío**: No carga datos si usuario acaba de completar test
- **Causa**: useEffect dependencies y sesión no disponible
- **Solución aplicada**: Cambiar a fetch directo de Supabase.auth.getUser()

❌ **Insights no aparecen**: API /api/post-test-insights-simple no retorna datos
- **Causa**: Posible error en generación de insights con IA
- **Check needed**: Console logs para ver respuesta API

❌ **Recomendaciones de libros**: No se cruza bien con Brain + Biblioteca
- **Causa**: Keywords de búsqueda quizá no son relevantes
- **Fix needed**: Mejorar mapeo de perfil DISC → keywords

---

### 10. EXPERIENCIA FINAL DEL USUARIO

**Tiempo total:** 15-20 minutos (10 min test + 5-10 min leyendo resultados)

**Lo que lleva:**
1. ✓ Informe profesional con 4 puntuaciones DISC
2. ✓ Análisis personalizado de naturaleza + fortalezas + oportunidades
3. ✓ 4-6 recomendaciones de libros relevantes a su perfil
4. ✓ Access a dashboard con historial y progreso
5. ✓ Datos guardados en BD para análisis futuro

**Calidad vs LiderDISC:**
- ✓ Estructura correcta (28 preguntas, 4 opciones)
- ✓ Scoring profesional (normalización a percentil)
- ✓ Informe detallado con análisis personalizado
- ✗ Falta: Gráficas más avanzadas (perfil dual, compatibilidad, etc)
- ✗ Falta: Índice de validez (detectar respuestas forzadas)
- ✗ Falta: Análisis de compatibilidad de roles
