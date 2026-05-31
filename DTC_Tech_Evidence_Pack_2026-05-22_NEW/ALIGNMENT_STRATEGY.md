# 🎯 ALINEAMIENTO CONCEPTUAL - DESPEGA TU CARRERA

## Veredicto: Funciona técnicamente pero necesita realineamiento conceptual

**Score Actual: 8.5/10 técnico, 7/10 alineación conceptual**

---

## PROBLEMAS IDENTIFICADOS Y SOLUCIONES

### 1️⃣ CONOZCÁMONOS-1: El Problema Central

**Problema:**
- Hoy es un assessment de 28 preguntas (demasiado fuerte)
- Debería ser un intake breve + contexto inicial
- El assessment PRINCIPAL debe ser A1 Cerebral

**Solución recomendada:**
```
CAMBIO ESTRUCTURAL:

Antes (Desalineado):
Login → Conozcámonos-1 (28 Q) → A1 Cerebral (28 Q) → Resultado

Después (Alineado):
Login → Conozcámonos-1 (5-7 Q breve) → A1 Cerebral (28 Q principal) → Resultado
```

**Impacto:**
- Conozcámonos-1 es contextual ("cuéntame de ti")
- A1 Cerebral es diagnóstico ("así funcionas")
- Resultado A1 es cierre ("esto significa...")

**Tablas afectadas:**
- `canon_conozcamonos_1_responses` → debería tener 5-7 campos, no 28
- Renombrar mentalmente: "intake" no "assessment"

---

### 2️⃣ FUENTE DE VERDAD DEL USUARIO

**Problema:**
- Flags en `despega_user_profiles` + data en múltiples tablas = riesgo de inconsistencia
- No está claro qué tabla es la "source of truth" para navegación

**Solución:**
```
CENTRALIZAR ESTADO EN despega_user_profiles:

onboarding_completed → bool (C-1 intake hecho)
onboarding_cerebral_completed → bool (A1 Cerebral hecho)
a1_test_completed → bool (A1 resultado listo)
conozcamonos_2_completed → bool (C-2 hecho)
a2_route_generated → bool (ruta 90d generada)
a2_missions_started → bool (misiones activadas)
a3_intro_completed → bool (A3 intro visto)
a3_entrevista_0_completed → bool (entrevista 0 hecho)
a3_training_started → bool (entrenamiento iniciado)
a4_unlocked → bool (acceso a A4)
```

**Regla simple:**
- **Para navegación:** usa flags de `despega_user_profiles`
- **Para contenido:** usa tablas específicas (assessment, responses, etc)
- **Nunca** uses table existence como criterio de acceso

---

### 3️⃣ REDIRECCIONAMIENTOS INTELIGENTES

**Problema:**
- A3 redirige a `/despega/a2/intro` genéricamente
- Pero si ya pasó por intro, vuelve a loop innecesario

**Solución:**
```typescript
// Lógica de prerequisitos mejorada:

if (!profile.onboarding_completed) 
  → redirect /despega/conozcamonos-1

if (!profile.onboarding_cerebral_completed) 
  → redirect /despega/a1-cerebral-intro

if (!profile.conozcamonos_2_completed) 
  → redirect /despega/conozcamonos-2

if (!profile.a2_route_generated) 
  → redirect /despega/a2/dashboard

if (!profile.a3_entrevista_0_completed) 
  → redirect /despega/a3/entrevista-0

if (!profile.a4_unlocked) 
  → redirect /despega/a2/intro // solo como último recurso
```

---

### 4️⃣ A2: FRAMING 30/60/90 CORRECTO

**Problema:**
- Dashboard dice "90-day missions" pero no explica el modelo 30/60/90

**Solución:**
```
CAMBIAR MESSAGING:

En A2 intro:
"Tu Misión 90 días se ejecuta en 3 períodos de 30 días:
• Aterrizaje (Días 1-30): Cimientos y exploración
• Consolidación (Días 31-60): Profundización y conexiones
• Maestría (Días 61-90): Integración y escalada"

En dashboard:
Mostrar el "dia actual" dentro del sprint
Mostrar progreso dentro del período 30d actual
```

---

### 5️⃣ A3: FORTALECER ENTREVISTA 0 Y FOCO REAL

**Problema:**
- A3 suena a "hub genérico de entrenamiento"
- No expresa claramente la promesa: "entrevistas reales"

**Solución:**
```
REFRAMING DE A3:

Titulo: "Entrenamiento de Entrevistas Reales"

Flujo:
1. Entrevista 0 (análisis inicial)
   - Grabación de video corta
   - Evaluación automática: luz, fondo, presencia, audio
   
2. Guiadas (coach asistido)
3. Estructuradas (framework)
4. Desafiantes (escenarios reales)
5. Maestría (integración completa)

Copy clave:
"No es un simulador. Es tu sala de entrenamiento
para que rindas mejor en entrevistas reales."
```

---

### 6️⃣ A1 RESULTADO: DEBE SER REPORTE WOW

**Problema:**
- `/despega/a1/resultado` podría ser solo un scorecard
- Debe ser reporte que CIERRE y PREPARE

**Solución:**
```
A1 RESULTADO debe tener:

1. Tu Perfil Cerebral
   - 4 dimensiones (Energía, Enfoque, Relaciones, Ejecución)
   - Radar visual
   - Descripción natural

2. Patrones de Funcionamiento
   - Fortalezas (3-4)
   - Áreas de desarrollo (3-4)
   - Cómo impacta tu performance

3. Entrevistas & Equipos
   - Cómo te presentas en entrevistas
   - Cómo trabajas con otros
   - Dinámicas que creas

4. Puente a A2
   - "Esto explica tu forma de avanzar"
   - "Tu misión 90d será diseñada con esto en mente"
   - CTA: "Vamos a tu próxima etapa"
```

---

## RESUMEN EJECUTIVO DE CAMBIOS

| Componente | Hoy | Debe Ser | Prioridad |
|-----------|-----|----------|-----------|
| Conozcámonos-1 | Assessment 28Q | Intake 5-7Q | 🔴 CRÍTICA |
| Fuente de Verdad | Múltiples | Centralizada en profile flags | 🔴 CRÍTICA |
| Redireccionamientos | Genéricos | Específicos/inteligentes | 🟠 ALTA |
| A2 Messaging | "90-day missions" | "30/60/90 model" | 🟠 ALTA |
| A3 Framing | "Hub training" | "Interview Real" | 🟠 ALTA |
| A1 Resultado | Scorecard | Reporte WOW + puente | 🟡 MEDIA |

---

## PLAN DE EJECUCIÓN (Prioridad)

### FASE 1 - CRÍTICA (Hoy)
1. Reconceptualizar Conozcámonos-1 como intake
2. Centralizar flags en despega_user_profiles
3. Actualizar todos los redireccionamientos

### FASE 2 - ALINEAMIENTO (Mañana)
4. Mejorar framing A2 (30/60/90)
5. Fortalecer promesa A3 (entrevista real)
6. Elevar A1 resultado a reporte

### FASE 3 - PULIDO (Próxima semana)
7. Copy refinement en todas las etapas
8. Testing de flujo de usuario
9. Validación de alineamiento conceptual

---

## NOTAS TÉCNICAS IMPORTANTES

- ✅ Las APIs de OpenAI están bien implementadas
- ✅ Las tablas de contenido están bien estructuradas
- ✅ El flujo general tiene buen skeleton
- ⚠️ La semántica conceptual es lo que necesita ajuste
- ⚠️ NO es un rehacer, es un realineamiento

---

**Conclusión:** El sistema funciona. Ahora necesita "canon limpio".
Esto es un trabajo de arquitectura y messaging, no de ingeniería compleja.
