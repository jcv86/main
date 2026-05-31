# Testing End-to-End: Post-Onboarding Connections

## Objetivo
Verificar que el sistema Despega funciona como un todo cohesivo post-onboarding, con todas las conexiones A1→A2→A3→A4→Coach funcionando correctamente.

## Test User: María (Perfil AZUL)
- Email: maria@test.com
- Password: Test123456!
- Perfil DISC: Perfil dominante I (Influencia), secundario D (Determinación)
- Scores: D=65, I=75, S=55, C=60

---

## Paso 1: Completar Onboarding (A1)

### Test 1.1 - Completar Test DISC
1. Ve a `/despega/onboarding`
2. Completa todas las preguntas del test DISC
3. Envía los resultados
4. **Verificar**: Se guarden los resultados en `unified_test_results` tabla

**Expected Output (Logs)**:
```
[v0] Fetched progress data: ...
[v0] Progress updated successfully: { tests_completed: 1, cerebral_completed: true }
[v0] Starting A1→A2 connection logic...
[v0] A2 recommendations saved: [...]
```

### Test 1.2 - Verificar A1→A2 Connection
1. Después de completar test, revisar que se crearon recomendaciones
2. **SQL Query**: `SELECT * FROM a2_suggested_routes WHERE user_id = 'maria-id'`
3. **Verificar**: 3 rutas recomendadas basadas en perfil I:
   - Comunicación Efectiva
   - Liderazgo de Equipos
   - Ventas y Negociación

---

## Paso 2: Ir al Dashboard (Transition)

### Test 2.1 - Ver Dashboard Rediseñado
1. Ve a `/despega` (dashboard principal)
2. **Verificar visuals**:
   - Stats con gradientes coloridos (puntos, ranking, progreso)
   - Sección perfil DISC visible
   - Los 4 Pilares mostrando progreso
   - News ticker en el header

---

## Paso 3: Completar A2 (Rutas - Misión 90 Días)

### Test 3.1 - Ver Recomendaciones A2
1. Ve a `/despega/a2/camino` o `/despega/a2/intro`
2. **Verificar**: Se muestren 3 rutas recomendadas del perfil I
3. Selecciona "Comunicación Efectiva"

### Test 3.2 - Crear Misión 90 Días
1. Ve a `/despega/a2/mision-90-dias`
2. Rellena:
   - Objetivo: "Mejorar mis habilidades de presentación y persuasión para cerrar más deals en mi trabajo"
   - Éxito: "Dar 5 presentaciones con feedback positivo de mi equipo"
3. Envía la misión
4. **Verificar logs**:
```
[v0] Starting A2→A3 connection...
[v0] A3 trainings assigned: 3
```

### Test 3.3 - Verificar A2→A3 Connection
1. **SQL Query**: `SELECT * FROM a3_training_assignments WHERE user_id = 'maria-id'`
2. **Verificar**: Se asignaron 3 entrenamientos relacionados con "comunicación"
   - Entrenamientos sobre presentación
   - Entrenamientos sobre persuasión
   - Entrenamientos sobre oratoria

---

## Paso 4: Activar Entrenamiento (A3)

### Test 4.1 - Ver Entrenamientos Asignados
1. Ve a `/despega/a3` o tab de entrenamientos
2. **Verificar**: Ve los 3 entrenamientos asignados automáticamente
3. Clickea en "Iniciar Entrenamiento" en uno de ellos

### Test 4.2 - Verificar A3→A4 Connection
1. Al iniciar el entrenamiento, revisa logs:
```
[v0] Training session created: [training-id]
[v0] A4 feed personalized for training: comunicación
```

2. **SQL Query**: `SELECT * FROM a4_personalized_feeds WHERE user_id = 'maria-id'`
3. **Verificar**: Se creó un feed personalizado con keywords:
   - comunicación
   - presentación
   - oratoria
   - influencia
   - persuasión

---

## Paso 5: Ver Noticias Personalizadas (A4)

### Test 5.1 - News Ticker en Header
1. Ve a cualquier página dentro de `/despega`
2. **Verificar**: El news ticker muestra 3 noticias relevantes sobre comunicación/presentación
3. Mira que cambie cada 8 segundos (lentamente)

### Test 5.2 - Página Completa de Noticias
1. Clickea "Ver todas →" del ticker o ve a `/despega/a4/noticias`
2. **Verificar**: Las noticias están filtradas por tema "comunicación"
3. Las noticias incluyen keywords relevantes

---

## Paso 6: Coach Omnipresente

### Test 6.1 - Coach Context
1. En cualquier página de `/despega`, observa el sidebar del Coach en la esquina inferior derecha
2. **Verificar el mensaje del Coach incluya contexto de**:
   - Acciones completadas (A2)
   - Progreso actual
   - Streak de días
   - Tasa de éxito

### Test 6.2 - Coach Acceso a Contexto Completo
1. Abre los dev tools → Console
2. Revisa que los logs muestren:
```
[v0] Loading omnipresent coach context...
[v0] Coach context loaded: Perfil: I ... | Misión: ... | Entrenamiento: comunicación | Contexto A4: ...
```

3. El Coach ahora tiene información de:
   - Perfil DISC de María (I dominante)
   - Su misión de 90 días
   - Su entrenamiento actual
   - El contexto de noticias de A4

---

## Paso 7: Actualizar Coach Context

### Test 7.1 - Guardar Snapshot de Contexto
1. **SQL Query Directo**:
```sql
INSERT INTO coach_context_snapshots (
  user_id, a1_context, a2_context, a3_context, a4_context, 
  contexto_completo, guardado_en
) VALUES (
  'maria-id',
  '{"nivel": "I", "scores": {...}}',
  '{"mision": "Comunicación", "ciclo": 1}',
  '{"tema": "Presentación", "progreso": 25}',
  '{"feed": "personalizado", "keywords": [...]}',
  'Perfil: I | Misión: Comunicación | Entrenamiento: Presentación | Contexto: personalizado',
  NOW()
)
```

2. **Verificar**: El snapshot se guardó correctamente
3. **GET /api/despega/get-coach-context?user_id=maria-id**
4. **Verificar**: Retorna el contexto completo

---

## Checklist de Verificación Final

- [ ] **A1→A2**: Test DISC genera recomendaciones personalizadas por perfil DISC
- [ ] **A2→A3**: Al crear misión en A2, se asignan automáticamente entrenamientos de A3
- [ ] **A3→A4**: Al iniciar entrenamiento en A3, se personaliza el feed de noticias en A4
- [ ] **Coach Omnipresente**: Coach tiene acceso a contexto completo A1+A2+A3+A4
- [ ] **News Ticker**: Header muestra noticias personalizadas y cambia lentamente
- [ ] **Dashboard**: Muestra estadísticas y progreso visual de los 4 pilares
- [ ] **No Errores**: Logs no muestran errores críticos (warnings no-críticos están OK)

---

## Debugging

### Si A1→A2 no funciona:
```
- Revisar: table a2_suggested_routes existe
- Verificar: NEWSAPI_KEY está configurada
- Logs: [v0] A2 recommendations saved
```

### Si A2→A3 no funciona:
```
- Revisar: table a3_training_assignments existe
- Verificar: tema_actual se pasa correctamente
- Logs: [v0] A3 trainings assigned
```

### Si A3→A4 no funciona:
```
- Revisar: table a4_personalized_feeds existe
- Verificar: training_id se pasa correctamente
- Logs: [v0] A4 feed personalized
```

### Si Coach no carga contexto:
```
- Revisar: table coach_context_snapshots existe
- Verificar: endpoint /api/despega/get-coach-context responde
- Logs: [v0] Coach context loaded
```

---

## Resultado Esperado

Un usuario (María) completa el onboarding, y el sistema automáticamente:
1. Identifica su perfil DISC (I dominante)
2. Recomienda rutas de A2 personalizadas
3. Al crear misión en A2, asigna entrenamientos en A3
4. Al activar entrenamiento en A3, personaliza noticias en A4
5. El Coach (Sofia/Dani) tiene contexto completo para dar consejos personalizados
6. Todo está conectado, cohesivo y automatizado
