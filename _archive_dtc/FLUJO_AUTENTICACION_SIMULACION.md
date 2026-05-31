# Despega - Flujo Completo de Autenticación y Tests
## Simulación para Usuario Nuevo

---

## PASO 1: LANDING PAGE → AUTH PAGE
### Estado Inicial
- Usuario visita `https://despega.app/`
- Ve página de inicio con:
  - Heading: "Despega"
  - Descripción: "Combina ciencia, tecnología y contenido de clase mundial..."
  - 3 Pilares principales:
    1. Tests Psicométricos Científicos (Purple)
    2. Biblioteca Profesional Completa (Blue)  
    3. Coach Virtual con IA (Cyan)
  - CTA Button: "Inicia Sesión o Regístrate →" (Gradient Purple→Blue)

### Acción del Usuario
- Click en botón "Inicia Sesión o Regístrate"
- Se redirige a `/auth`

---

## PASO 2: PÁGINA DE AUTENTICACIÓN - REGISTRO
### URL: `/auth?signup=true`

### Interfaz
```
┌─────────────────────────────────────┐
│         Despega                     │
│    Inicia Sesión o Regístrate      │
├─────────────────────────────────────┤
│  ✓ Iniciar Sesión | Regístrate     │
├─────────────────────────────────────┤
│                                     │
│  📧 Correo Electrónico              │
│  [usuario@email.com          ]      │
│                                     │
│  🔒 Contraseña                      │
│  [••••••••••••••••         ][👁]     │
│                                     │
│  🔒 Confirmar Contraseña            │
│  [••••••••••••••••         ][👁]     │
│                                     │
│  [→ Crear Cuenta]                   │
│                                     │
│  ¿Ya tienes cuenta?                 │
│  Inicia Sesión →                    │
└─────────────────────────────────────┘
```

### Datos Ingresados (Simulación)
- Email: `juan@example.com`
- Contraseña: `Despega123!`
- Confirmar: `Despega123!`

### Validaciones
✓ Email válido
✓ Contraseña ≥ 6 caracteres
✓ Contraseñas coinciden
✓ No duplicado en BD

### Respuesta del Servidor
- API Call: `POST /api/auth/signup`
- Cuerpo:
  ```json
  {
    "email": "juan@example.com",
    "password": "Despega123!",
    "name": "Juan Pérez"
  }
  ```

### Resultado
- Usuario creado en Supabase (`auth.users`)
- Entrada creada en tabla `profiles`
- Token de sesión generado
- Redirect a `/dashboard`

---

## PASO 3: INGRESO A DASHBOARD
### URL: `/dashboard`

### Componentes Renderizados
1. **Header**: Nombre usuario + Opción logout
2. **Navigation Sidebar**:
   - Home
   - Tests
   - Resultados
   - Chat/Coach
   - Perfil

3. **Welcome Card**:
   ```
   Bienvenido, Juan
   Parece que es tu primera vez aquí.
   Comienza completando tu perfil con tests psicométricos.
   ```

4. **Tests Disponibles**:
   - [ ] Despega Cerebral & Mapa de Personalidad
   - [ ] 5 Dimensiones & Brújula Vocacional  
   - [ ] Inteligencia Emocional Despega
   - [ ] Competencias Despega

---

## PASO 4: SELECCIÓN DE TEST - "DESPEGA CEREBRAL"
### Acción del Usuario
- Click en test "Despega Cerebral & Mapa de Personalidad"
- Se abre modal/página de introducción

### Información del Test
```
╔═══════════════════════════════════════════════╗
║       Despega Cerebral & Mapa de Personalidad║
║───────────────────────────────────────────────║
║ Duración: 12-15 minutos                       ║
║ Preguntas: 80 items                           ║
║ Confiabilidad: Validado científicamente       ║
║                                               ║
║ Este test mide:                               ║
║ • Estilos de pensamiento                      ║
║ • Preferencias de personalidad                ║
║ • Orientación profesional                     ║
║                                               ║
║ [← Atrás]              [Comenzar Test →]      ║
╚═══════════════════════════════════════════════╝
```

### Usuario Hace Click
- "Comenzar Test"
- Se inicia sesión de test con timestamp

---

## PASO 5: RESPONDIENDO EL TEST
### Interfaz del Test
```
┌──────────────────────────────────────┐
│  Despega Cerebral (15/80)            │
│  ████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │ 18%
└──────────────────────────────────────┘

Pregunta 15:
"Cuando enfrento un problema complejo,
mi primer instinto es:"

○ Analizar todos los hechos disponibles
○ Confiar en mi intuición
○ Consultar con otros
○ Buscar un enfoque creativo

[← Atrás]  [Siguiente →]
```

### Simulación de Respuestas (15 preguntas de muestra)

| Num | Pregunta | Respuesta | Dimensión |
|-----|----------|-----------|-----------|
| 1 | Primer instinto ante problemas | Analizar hechos | Lógica |
| 2 | Preferencia en proyectos | Trabajo en equipo | Social |
| 3 | Tipo de ambiente laboral | Estructurado | Orden |
| 4 | Aprendizaje | Práctica | Kinestésico |
| 5 | Toma de decisiones | Datos + Instinto | Híbrido |
| 6 | Motivación principal | Crecimiento | Desarrollo |
| 7 | Manejo del cambio | Adaptable | Flexible |
| 8 | Interacción grupal | Líder natural | Leadership |
| 9 | Creatividad vs. Reglas | Equilibrio | Balanceado |
| 10 | Energía | Introvertido | Reflexivo |
| 11 | Precisión | Muy importante | Detallista |
| 12 | Riesgos | Calculados | Prudente |
| 13 | Visión futura | Importante | Visión |
| 14 | Empatía | Alta | Empático |
| 15 | Competencia | Excelencia | Ambicioso |

### Datos Enviados al Servidor
```json
{
  "userId": "juan-uuid-123",
  "testId": "despega-cerebral",
  "responses": [
    {"questionId": 1, "answer": "opcion_a", "timestamp": "2026-02-06T10:00:01Z"},
    {"questionId": 2, "answer": "opcion_b", "timestamp": "2026-02-06T10:00:15Z"},
    ...
  ],
  "startTime": "2026-02-06T09:50:00Z",
  "endTime": "2026-02-06T10:02:30Z",
  "totalTime": 745  // segundos
}
```

---

## PASO 6: FINALIZACIÓN DEL TEST
### Pantalla de Finalización
```
┌────────────────────────────────────────┐
│     ✓ Test Completado                  │
│                                        │
│  Tiempo total: 12 min 25 seg           │
│  Preguntas respondidas: 80/80          │
│                                        │
│  Procesando resultados...              │
│  ████████████████░░░░░░░░░░░░░░░░░░░  │
│                                        │
│  [Ir a Resultados →]                   │
└────────────────────────────────────────┘
```

### Procesamiento Backend
1. **Validación de Respuestas**
   - Verificar que todas las 80 preguntas fueron respondidas
   - Validar que respuestas están dentro de rango válido

2. **Cálculo de Puntuaciones**
   ```javascript
   const dimensions = {
     thinking: 78,      // Lógica/Análisis (0-100)
     social: 65,        // Interacción Social (0-100)
     creativity: 72,    // Creatividad (0-100)
     organization: 81,  // Orden/Estructura (0-100)
     leadership: 68,    // Liderazgo (0-100)
   }
   ```

3. **Generación de Perfil**
   - Tipo de personalidad: "Analítico-Colaborativo"
   - Orientación vocacional: "Roles técnico-directivos"
   - Fortalezas principales: Análisis, organización, empatía
   - Áreas de desarrollo: Tolerancia al riesgo, espontaneidad

4. **Almacenamiento en BD**
   ```sql
   INSERT INTO test_results 
   (user_id, test_id, score, profile_data, created_at)
   VALUES 
   ('juan-uuid-123', 'despega-cerebral', 73, '{...}', NOW())
   ```

---

## PASO 7: VISUALIZACIÓN DE RESULTADOS
### URL: `/results/juan-uuid-123/despega-cerebral`

### Componentes
```
╔════════════════════════════════════════════════════════╗
║     Tus Resultados - Despega Cerebral                 ║
├────────────────────────────────────────────────────────┤
║                                                        ║
║  Puntuación General: 73/100                           ║
║  ████████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  ║
║                                                        ║
║  📊 Perfil de Personalidad                             ║
║  ──────────────────────────────────────────            ║
║  Tipo: Analítico-Colaborativo                          ║
║  Descripción: Te destaca como pensador estratégico     ║
║  con fuerte capacidad de trabajo en equipo             ║
║                                                        ║
║  📈 Dimensiones Principales                            ║
║  ──────────────────────────────────────────            ║
║  Análisis Lógico      ████████████░░░░░░░  78/100    ║
║  Interacción Social   █████████░░░░░░░░░░░  65/100    ║
║  Creatividad          ███████████░░░░░░░░░  72/100    ║
║  Organización         ████████████░░░░░░░░  81/100    ║
║  Liderazgo            ████████░░░░░░░░░░░░  68/100    ║
║                                                        ║
║  🎯 Carreras Recomendadas                              ║
║  ──────────────────────────────────────────            ║
║  1. Ingeniero de Software (match 87%)                 ║
║  2. Analista de Datos (match 84%)                     ║
║  3. Project Manager (match 79%)                       ║
║                                                        ║
║  [← Volver]  [Próximo Test →]                          ║
╚════════════════════════════════════════════════════════╝
```

### Datos Mostrados
```javascript
const results = {
  testName: "Despega Cerebral & Mapa de Personalidad",
  completedDate: "2026-02-06",
  totalScore: 73,
  personalityType: "Analítico-Colaborativo",
  description: "Tu perfil combina pensamiento lógico con capacidad...",
  dimensions: {
    logicalAnalysis: 78,
    socialInteraction: 65,
    creativity: 72,
    organization: 81,
    leadership: 68
  },
  recommendations: [
    { career: "Software Engineer", match: 87 },
    { career: "Data Analyst", match: 84 },
    { career: "Project Manager", match: 79 }
  ],
  insights: [
    "Tu fortaleza principal es el pensamiento estratégico",
    "Aprovecha tu capacidad de organización en roles de coordinación",
    "Desarrolla tu liderazgo para roles directivos"
  ]
}
```

---

## PASO 8: SIGUIENTE TEST - "5 DIMENSIONES"
### Flujo
1. Usuario hace click en "Próximo Test"
2. Se abre "5 Dimensiones & Brújula Vocacional"
3. Mismo flujo que Test 1:
   - Introducción (2 min)
   - Test (10-12 min)
   - Resultados instantáneos

### Datos Generados
```javascript
{
  userId: "juan-uuid-123",
  testId: "5-dimensiones",
  results: {
    dimensión1: 74,  // Rasgos (Big Five)
    dimensión2: 68,  // Vocación
    dimensión3: 79,  // Compatibilidad
    dimensión4: 71,  // Preferencias
    dimensión5: 85   // Aptitud
  },
  vocationMatch: "Tecnología / Dirección"
}
```

---

## PASO 9: CONSOLIDACIÓN DE RESULTADOS
### Dashboard Actualizado
```
╔══════════════════════════════════════════════╗
║   Tu Perfil Profesional Consolidado         ║
├──────────────────────────────────────────────┤
║                                              ║
║  Pruebas Completadas: 2/4                   ║
║  ██████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   ║
║                                              ║
║  ✓ Despega Cerebral: 73/100                 ║
║  ✓ 5 Dimensiones: 77/100                    ║
║  ⊙ Inteligencia Emocional (Pendiente)       ║
║  ⊙ Competencias (Pendiente)                 ║
║                                              ║
║  Perfil Detectado: Analítico-Visionario     ║
║                                              ║
║  Carreras Top 3:                             ║
║  1. Product Manager (85% match)              ║
║  2. Tech Lead (83% match)                    ║
║  3. UX Strategist (80% match)                ║
║                                              ║
║  [Continuar Tests...]                        ║
╚══════════════════════════════════════════════╝
```

### Base de Datos (Supabase)
```sql
-- Tabla: profiles
│ id | email | name | created_at | profile_type |
│ 1 | juan@example.com | Juan | 2026-02-06 | Analítico-Visionario |

-- Tabla: test_results
│ id | user_id | test_id | score | completed_at |
│ 1 | 1 | despega-cerebral | 73 | 2026-02-06 10:02 |
│ 2 | 1 | 5-dimensiones | 77 | 2026-02-06 10:25 |

-- Tabla: user_recommendations
│ id | user_id | career | match_percentage |
│ 1 | 1 | Product Manager | 85 |
│ 2 | 1 | Tech Lead | 83 |
│ 3 | 1 | UX Strategist | 80 |
```

---

## PASO 10: ACCESO A CHAT/COACH
### URL: `/coach` o `/chat`

### Iniciar Sesión con Coach
```
Usuario: "Hola, basándome en mis resultados, 
         ¿qué debería hacer para mejorar mis 
         habilidades de liderazgo?"

Coach IA responde:
"Basándome en tu perfil Analítico-Visionario,
aquí están mis recomendaciones:

1. **Fortalezas a aprovechar:**
   - Tu pensamiento estratégico (score 78)
   - Tu capacidad de organización (score 81)

2. **Desarrollo de liderazgo:**
   - Tomar un curso de coaching ejecutivo
   - Practicar comunicación empática
   - Liderar un proyecto piloto

3. **Recursos recomendados:**
   - Libro: 'Liderazgo Transformacional'
   - Webinar: 'Comunicación para Líderes'
   - Mentoría 1-1 (disponible)"
```

---

## RESUMEN COMPLETO DEL FLUJO

| Paso | Acción | Duración | Estado |
|------|--------|----------|--------|
| 1 | Landing → Auth | <5 seg | ✓ |
| 2 | Registro/Login | ~1 min | ✓ |
| 3 | Dashboard | Instantáneo | ✓ |
| 4 | Selección Test | <1 min | ✓ |
| 5 | Test 1 Completado | 12-15 min | ✓ |
| 6 | Resultados Test 1 | Instantáneo | ✓ |
| 7 | Test 2 Completado | 10-12 min | ✓ |
| 8 | Consolidación | Instantáneo | ✓ |
| 9 | Coach Disponible | 24/7 | ✓ |
| **Total** | **Usuario Full** | **25-30 min** | **✓✓✓** |

---

## CHECKLIST DE FUNCIONALIDADES

### Autenticación
- [x] Registro de nuevo usuario
- [x] Validación de datos
- [x] Almacenamiento en BD
- [x] Generación de sesión
- [x] Login existente

### Tests
- [x] Visualización de tests disponibles
- [x] Interfaz interactiva
- [x] Progreso visual (barra de porcentaje)
- [x] Navegación (atrás/siguiente)
- [x] Validación de respuestas

### Resultados
- [x] Cálculo automático de puntajes
- [x] Generación de perfil personalizado
- [x] Visualización de dimensiones
- [x] Recomendaciones de carrera
- [x] Insights personalizados

### Dashboard
- [x] Vista consolidada de progreso
- [x] Estado de todos los tests
- [x] Perfil detectado
- [x] Recomendaciones top 3

### Coach IA
- [x] Inicialización con contexto de usuario
- [x] Respuestas basadas en perfil
- [x] Recomendaciones personalizadas
- [x] Disponibilidad 24/7

---

## ERRORES A PREVENIR

❌ **No hacer:**
- Perder datos de sesión entre páginas
- Dejar tests incompletos sin guardar
- No validar datos antes de enviar
- Mostrar errores genéricos (sin contexto)
- Permitir usuario acceda a resultados ajenos

✓ **Hacer:**
- Persistir sesión en SessionWrapper
- Guardar respuestas cada X minutos
- Validar en cliente y servidor
- Errores específicos y útiles
- Row Level Security en Supabase

---

## ESTADO ACTUAL DE IMPLEMENTACIÓN

✓ **Completado:**
- Landing page con 3 pilares
- Auth page (login/signup)
- Session wrapper
- Test runners

⚠️ **En Desarrollo:**
- Consolidación de resultados
- Recomendaciones de carrera
- Coach IA contexto

❌ **Pendiente:**
- Integraciones ChileValora
- Gamification
- Seguimiento de progreso
