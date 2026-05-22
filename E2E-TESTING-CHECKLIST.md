# E2E TESTING CHECKLIST - COPIAR Y PEGAR

**Fecha**: Mayo 22, 2026  
**Tiempo**: 60 minutos  
**App URL**: http://localhost:3000 (o tu preview)

---

## ANTES DE EMPEZAR

- [ ] App está corriendo en navegador
- [ ] Tienes sesión clara (privada si es posible)
- [ ] Console abierta (F12) para errores
- [ ] Tienes este documento abierto

---

## TEST 1: AUTHENTICATION & ONBOARDING (5 minutos)

**Objetivo**: Usuario nuevo puede registrarse y acceder

```
Step 1: Sign Up
  [ ] Navega a /signup
  [ ] Email: test-qa-[timestamp]@test.com
  [ ] Password: TestPassword123!
  [ ] Haz click en "Sign Up"
  Expected: Verás "Check your email" message
  Status: [ ] PASS [ ] FAIL

Step 2: Email Verification
  [ ] Ve a inbox (si usas email real)
  [ ] O verifica en Supabase Auth dashboard
  Expected: Email verificado o puedes continuar
  Status: [ ] PASS [ ] FAIL

Step 3: Complete Profile
  [ ] Haz click en verification link (o auto-continues)
  [ ] Completa perfil (nombre, etc)
  [ ] Click "Continue"
  Expected: Redirección a /a1-dashboard
  Status: [ ] PASS [ ] FAIL

Step 4: See A1 Dashboard
  [ ] Deberías estar en /a1-dashboard
  [ ] Ver "Day 1" o "Mission 1"
  [ ] Ver puntos (0 initial)
  Expected: Dashboard cargado correctamente
  Status: [ ] PASS [ ] FAIL

Result for Test 1: [ ] PASS [ ] FAIL
```

---

## TEST 2: MISSION COMPLETION RPC (5 minutos)

**Objetivo**: Completing mission da puntos y no duplica

```
Step 1: Complete First Mission
  [ ] Navega a /a1-dashboard (si no estás)
  [ ] Ve a "Day 1"
  [ ] Busca botón "Complete" o "Mark as Done"
  [ ] Click para completar
  Expected: Button desaparece, state cambia
  Status: [ ] PASS [ ] FAIL

Step 2: Check Puntos Added
  [ ] Mira puntos total en dashboard
  [ ] Deberían ser "10" (o initial + 10)
  [ ] Chequea también en Supabase:
    SELECT puntos FROM despega_a1_progress WHERE user_id = [tu_id]
  Expected: Exacto 10 puntos
  Status: [ ] PASS [ ] FAIL

Step 3: Double-Click Test (Idempotencia)
  [ ] Si el botón reaparece, haz double-click rápido
  [ ] O intenta completar de nuevo vía API console
  [ ] Verifica puntos no duplican
  Expected: Puntos siguen siendo 10 (no 20)
  Status: [ ] PASS [ ] FAIL

Step 4: Database Verification
  [ ] Abre Supabase Console
  [ ] Ejecuta: SELECT * FROM despega_a1_progress WHERE user_id = [tu_id]
  [ ] Verifica puntos = 10, no mayor
  Expected: 1 row, puntos correctos
  Status: [ ] PASS [ ] FAIL

Result for Test 2: [ ] PASS [ ] FAIL
```

---

## TEST 3: CYCLE MANAGEMENT (5 minutos)

**Objetivo**: Ciclos separados, data preservada

```
Step 1: Complete Days 1-5 (Simulated)
  [ ] Completa misiones Days 1-5 (o manualmente actualiza en DB)
  [ ] Verifica puntos llegan a 50+
  Expected: Days completados
  Status: [ ] PASS [ ] FAIL

Step 2: Check Cycle ID
  [ ] Abre Supabase Console
  [ ] SELECT cycle_id, puntos FROM despega_pilar_progress WHERE user_id = [tu_id]
  [ ] Anota cycle_id (debería ser UUID)
  Expected: cycle_id tiene valor UUID
  Status: [ ] PASS [ ] FAIL

Step 3: Start New Cycle
  [ ] Si hay botón "New Cycle" u opción similar, haz click
  [ ] O manualmente reset días pero mantén ciclos
  [ ] Verifica new_cycle_id es diferente
  Expected: Nuevo cycle_id creado
  Status: [ ] PASS [ ] FAIL

Step 4: Access Previous Cycle Data
  [ ] Busca forma de ver ciclos anteriores (si UI lo permite)
  [ ] O verifica en DB que old cycle_id existe
  [ ] SELECT * FROM despega_pilar_progress WHERE cycle_id = [old_cycle_id]
  Expected: Datos del ciclo anterior intactos
  Status: [ ] PASS [ ] FAIL

Step 5: Verify Data Preservation
  [ ] Compara puntos cycle 1 vs cycle 2
  [ ] Ambos deberían tener datos separados
  Expected: 0 data corruption, separación completa
  Status: [ ] PASS [ ] FAIL

Result for Test 3: [ ] PASS [ ] FAIL
```

---

## TEST 4: SMART MIDDLEWARE REDIRECTS (5 minutos)

**Objetivo**: No puedes saltar días, middleware redirige inteligentemente

```
Step 1: Try Accessing Day 15 on Day 5
  [ ] Si estás en Day 5, intenta ir a /a2/day-15
  [ ] O si hay selector, selecciona Day 15
  [ ] App debería redirigir a Day 5
  Expected: Redirección automática a día actual
  Status: [ ] PASS [ ] FAIL

Step 2: Verify Redirect Works
  [ ] Mira URL después, debería ser /a2/day-5 (o actual)
  [ ] No infinite loop
  [ ] Page carga correctamente
  Expected: Redirect limpio, sin errores
  Status: [ ] PASS [ ] FAIL

Step 3: Complete Day 5
  [ ] Completa actual day
  Expected: Puedes proceder a Day 6
  Status: [ ] PASS [ ] FAIL

Step 4: Can Now Access Day 6
  [ ] Intenta acceder a Day 6
  [ ] Debería permitir acceso
  [ ] URL: /a2/day-6
  Expected: Acceso permitido
  Status: [ ] PASS [ ] FAIL

Step 5: Verify A2→A3 Transition Flag
  [ ] Complete todos los 90 días (simulado)
  [ ] Chequea flag: is_a2_pilar_complete = true
  [ ] Chequea flag: is_a3_unlocked = true
  [ ] Navigation debería mostrar A3 disponible
  Expected: Flags correctos, navigation actualizado
  Status: [ ] PASS [ ] FAIL

Result for Test 4: [ ] PASS [ ] FAIL
```

---

## TEST 5: A2→A3 TRANSITION (5 minutos)

**Objetivo**: Seamless transition cuando A2 se completa

```
Step 1: Complete A2 Module (Day 90)
  [ ] Simula completar A2 day 90
  [ ] O manualmente: UPDATE despega_pilar_progress SET is_a2_pilar_complete = true
  Expected: A2 marked complete
  Status: [ ] PASS [ ] FAIL

Step 2: Check is_a2_pilar_complete Flag
  [ ] SELECT is_a2_pilar_complete FROM despega_pilar_progress WHERE user_id = [tu_id]
  [ ] Debería ser true
  Expected: Flag = true
  Status: [ ] PASS [ ] FAIL

Step 3: Verify is_a3_unlocked Flag
  [ ] SELECT is_a3_unlocked FROM despega_pilar_progress WHERE user_id = [tu_id]
  [ ] Debería ser true (auto-set)
  Expected: Flag = true (auto-unlocked)
  Status: [ ] PASS [ ] FAIL

Step 4: See A3 in Navigation
  [ ] Recarga app o ve a /navigation
  [ ] Busca "A3" opción
  [ ] Debería estar visible (no grayed out)
  Expected: A3 disponible en navegación
  Status: [ ] PASS [ ] FAIL

Step 5: Access A3 Modules
  [ ] Click en A3
  [ ] Debería ver módulos A3
  [ ] Can click y enter
  Expected: A3 módulos accesibles
  Status: [ ] PASS [ ] FAIL

Result for Test 5: [ ] PASS [ ] FAIL
```

---

## TEST 6: A4 CONTEXT COACH API (5 minutos)

**Objetivo**: Real-time IA responses

```
Step 1: Open A4 Page
  [ ] Navega a /a4 o "IA Coach" en navegación
  [ ] Page debería cargar
  Expected: A4 interface visible
  Status: [ ] PASS [ ] FAIL

Step 2: Send Message
  [ ] Input box visible
  [ ] Type: "¿Cuál es mi mayor fortaleza profesional?"
  [ ] Click "Send" o press Enter
  Expected: Message aparece en chat
  Status: [ ] PASS [ ] FAIL

Step 3: See Streaming Response
  [ ] IA debería responder
  [ ] Verifica que es streaming (palabras aparecen gradualmente)
  [ ] No click para esperar response
  Expected: Response en < 2 segundos, real-time feel
  Status: [ ] PASS [ ] FAIL

Step 4: Measure Latency
  [ ] Abre browser DevTools (F12)
  [ ] Network tab
  [ ] Mira tiempo de response
  [ ] Debería ser < 2000ms (ideally < 1000ms)
  Expected: Latency < 2s
  Status: [ ] PASS [ ] FAIL

Step 5: Try Multiple Messages
  [ ] Envía 3-5 mensajes seguidos
  [ ] Verifica cada uno responde correctamente
  [ ] No crashes o errores
  Expected: Múltiples intercambios smooth
  Status: [ ] PASS [ ] FAIL

Result for Test 6: [ ] PASS [ ] FAIL
```

---

## TEST 7: DATABASE ATOMICITY (5 minutos)

**Objetivo**: Transacciones no corrupten datos

```
Step 1: Execute RPC Function
  [ ] Abre Supabase Console
  [ ] Execute: SELECT complete_a1_mission_transaction([user_id], [mission_id])
  [ ] Verifica puntos se actualizan
  Expected: RPC executes sin error
  Status: [ ] PASS [ ] FAIL

Step 2: Simulate Network Failure (Avanzado)
  [ ] Abre DevTools (F12)
  [ ] Network tab
  [ ] Throttle a "Slow 3G"
  [ ] Mientras transacción está en progreso, cierra DevTools (simula disconnect)
  Expected: App maneja gracefully
  Status: [ ] PASS [ ] FAIL

Step 3: Verify Rollback Occurred
  [ ] Recarga página
  [ ] Verifica datos no quedaron en estado parcial
  [ ] SELECT * FROM despega_a1_progress WHERE user_id = [tu_id]
  Expected: Datos consistentes (all-or-nothing)
  Status: [ ] PASS [ ] FAIL

Step 4: Check No Partial Data
  [ ] Busca registros incompletos
  [ ] Todos deberían estar completos o no existir
  Expected: 0 partial/corrupt records
  Status: [ ] PASS [ ] FAIL

Step 5: Retry Transaction Succeeds
  [ ] Reconecta red
  [ ] Intenta transacción de nuevo
  [ ] Debería completar exitosamente
  Expected: Retry works después de recovery
  Status: [ ] PASS [ ] FAIL

Result for Test 7: [ ] PASS [ ] FAIL
```

---

## TEST 8: PROGRESS FLAGS CONSISTENCY (5 minutos)

**Objetivo**: Flags siempre consistentes

```
Step 1: Check Flags in DB
  [ ] Abre Supabase Console
  [ ] SELECT is_a2_pilar_complete, is_a3_unlocked, is_a4_unlocked 
       FROM despega_pilar_progress WHERE user_id = [tu_id]
  [ ] Anota valores (true/false)
  Expected: Todos booleanos, values bien definidos
  Status: [ ] PASS [ ] FAIL

Step 2: Complete Milestones
  [ ] Completa A1 día 1
  [ ] Completa primeros 5 días A2
  [ ] Verify flags actualizar en real-time
  Expected: Flags change reactivamente
  Status: [ ] PASS [ ] FAIL

Step 3: Verify Flags Update
  [ ] Recorre la secuencia de completion
  [ ] Chequea flags actualizan cada step
  Expected: Progressive flag updates
  Status: [ ] PASS [ ] FAIL

Step 4: Check UI Reflects Flags
  [ ] Navega a A3/A4
  [ ] Busca "locked" vs "unlocked" indicators
  [ ] Debería coincidir con DB flags
  Expected: UI = DB (100% sync)
  Status: [ ] PASS [ ] FAIL

Step 5: Navigation Respects Flags
  [ ] Si A3 = locked (is_a3_unlocked = false), no accesible
  [ ] Si A3 = unlocked (is_a3_unlocked = true), accesible
  [ ] Same para A4
  Expected: Navigation gate correctamente
  Status: [ ] PASS [ ] FAIL

Result for Test 8: [ ] PASS [ ] FAIL
```

---

## TEST 9: LOAD TESTING (5 minutos)

**Objetivo**: App performante con múltiples usuarios

```
Step 1: Open 3-5 Browser Tabs
  [ ] Navega a app en 3-5 tabs
  [ ] Usa different usuarios (o mismo si no importa)
  [ ] Cada tab en diferentes rutas
  Expected: Todos load sin conflict
  Status: [ ] PASS [ ] FAIL

Step 2: Navigate Concurrently
  [ ] En cada tab, rápidamente navega entre pages
  [ ] Tab 1: A1 → A2 → A3
  [ ] Tab 2: A2 → A4 → A1
  [ ] Tab 3: A3 → A2 → A1
  Expected: No racing conditions
  Status: [ ] PASS [ ] FAIL

Step 3: Measure Response Times
  [ ] Abre DevTools Network tab (uno de los tabs)
  [ ] Verifica tiempos de requests
  [ ] Debería ser < 500ms p95
  Expected: Fast responses bajo load
  Status: [ ] PASS [ ] FAIL

Step 4: Check for Timeouts
  [ ] Si algún request toma > 3s, nota
  [ ] Check console para errores
  [ ] Debería haber 0 timeout errors
  Expected: 0 timeouts
  Status: [ ] PASS [ ] FAIL

Step 5: Verify DB Pooling Active
  [ ] Abre Supabase dashboard
  [ ] Check "Connections" meter
  [ ] Debería mostrar 3-5 conexiones (no 50+)
  [ ] Pooling está funcionando
  Expected: Efficient connection pooling
  Status: [ ] PASS [ ] FAIL

Result for Test 9: [ ] PASS [ ] FAIL
```

---

## TEST 10: ERROR RECOVERY (5 minutos)

**Objetivo**: Graceful error handling

```
Step 1: Trigger API Error
  [ ] DevTools → Network tab → Offline
  [ ] Intenta acción (complete mission, send message)
  [ ] App debería mostrar error message
  Expected: User-friendly error displayed
  Status: [ ] PASS [ ] FAIL

Step 2: See Error Message
  [ ] Debería haber toast/modal con error
  [ ] Mensaje debería ser claro (no technical)
  [ ] Sugerir retry o acción
  Expected: Good error UX
  Status: [ ] PASS [ ] FAIL

Step 3: Retry Button Available
  [ ] Error message debería tener "Retry" botón
  [ ] No disabled o hidden
  Expected: Retry button visible & clickable
  Status: [ ] PASS [ ] FAIL

Step 4: Reconnect and Retry
  [ ] Network tab → Online
  [ ] Click "Retry"
  [ ] App debería reintent la acción
  Expected: Retry succeeds después de reconnection
  Status: [ ] PASS [ ] FAIL

Step 5: Verify No Infinite Loops
  [ ] Chequea console (F12)
  [ ] No "Error: Error: Error" loops
  [ ] No infinite API calls
  [ ] App debería estar en estado limpio
  Expected: 0 infinite loops, clean state
  Status: [ ] PASS [ ] FAIL

Result for Test 10: [ ] PASS [ ] FAIL
```

---

## FINAL SUMMARY

**Total Tests**: 10  
**Total Time**: 60 minutes

**Results**:
```
Test 1: [ ] PASS [ ] FAIL
Test 2: [ ] PASS [ ] FAIL
Test 3: [ ] PASS [ ] FAIL
Test 4: [ ] PASS [ ] FAIL
Test 5: [ ] PASS [ ] FAIL
Test 6: [ ] PASS [ ] FAIL
Test 7: [ ] PASS [ ] FAIL
Test 8: [ ] PASS [ ] FAIL
Test 9: [ ] PASS [ ] FAIL
Test 10: [ ] PASS [ ] FAIL
```

**Overall Result**:
- [ ] 10/10 PASS → ✅ QA APPROVED
- [ ] < 10/10 → Document failures, use TROUBLESHOOTING-GUIDE.md

**Report to Slack**:
```
QA: ✅ PASSED ALL TESTS (10/10)
or
QA: ⚠️ FAILURES - See below
  - Test X: [description]
  - Test Y: [description]
  Fixing now...
```

---

**Documento**: E2E-TESTING-CHECKLIST.md  
**Date**: Mayo 22, 2026  
**Status**: Ready for QA execution

