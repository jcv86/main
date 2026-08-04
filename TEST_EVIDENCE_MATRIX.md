# Matriz de evidencia de validación

Los checks del repositorio no tienen todos el mismo alcance. Un resultado verde debe interpretarse según el nivel de evidencia que realmente ejecutó.

## Niveles

- **Runtime only:** ejecuta funciones de producto con fixtures positivos y negativos. No inspecciona rutas ni base de datos.
- **Mixed runtime + source:** ejecuta lógica pura y además inspecciona archivos para confirmar wiring, rutas, migraciones o copy.
- **Source only:** inspecciona archivos y orden de llamadas. No ejecuta endpoints, SQL ni navegación real.
- **Production bundle:** compila Next.js y genera la tabla de rutas. No inicia un servidor ni abre un navegador.
- **Live database audit:** consulta DTCFINAL directamente. Se ejecuta de forma separada y de solo lectura, porque CI no usa credenciales de producción.

## Cobertura actual en CI

| Nivel | Cantidad |
|---|---:|
| Runtime only | 1 |
| Mixed runtime + source | 21 |
| Source only | 16 |
| Live HTTP | 0 |
| Live database | 0 |
| Browser end-to-end | 0 |

El workflow valida 38 contratos de dominio. La lista exacta y su clasificación se controlan automáticamente en `scripts/check-test-evidence-matrix.ts`.

Los contratos adicionales comprueban que:

- los endpoints de gamificación no acepten IDs, puntajes, montos ni compras controlados por el navegador;
- las rutas heredadas de A3 no ejecuten puntajes aleatorios, escrituras desde el cliente o flujos paralelos;
- cada combinación sesión/pregunta de entrevista tenga una sola respuesta y que el guardado con la suma de XP ocurra dentro de una transacción atómica del servidor;
- los endpoints heredados de progreso y recompensas no puedan marcar módulos completos ni entregar XP/DTC sin evidencia validada;
- ningún helper acepte identidad decodificando JWT sin verificar firma ni exista un tracker paralelo que calcule recompensas desde puntajes autorreportados;
- las rutas de coaching A2/A3 verifiquen sesión Supabase, acoten el payload, no usen `service_role`, no acepten `userId` del navegador y desactiven almacenamiento de respuestas del proveedor;
- la ejecución genérica de AgentOS no esté expuesta por HTTP ni permita invocar comandos internos con parámetros arbitrarios;
- el webhook público de auto-detección no acepte firmas débiles, no permita disparos manuales por `userId` y no ejecute job matching antes del gate A3 → A4;
- los endpoints legacy de Conozcámonos 1 y 2 no acepten `user_id` del navegador ni dupliquen la persistencia canónica basada en sesión;
- el modal legacy del Día 1 no publique documentos personales, no acepte cookies demo sin firma ni presente coaching mock como una capacidad real;
- el job matching de A4 respete el acceso persistido A3 → A4 y acote sus parámetros;
- el seed público de ofertas A4 no pueda usar `service_role`, insertar datos ficticios ni reemplazar el job matching autenticado;
- la superficie administrativa no consulte tablas inexistentes, no use correos públicos como autorización ni permita desbloqueos o reinicios destructivos;
- la autenticación demo no emita ni acepte identidades paralelas, elimine cookies antiguas y mantenga fuera del repositorio los archivos con credenciales demo.

## Lo que un verde sí demuestra

- TypeScript compila sin errores en todo el repositorio.
- Los validadores puros aceptan y rechazan los fixtures cubiertos.
- Las estructuras canónicas, rutas, llamadas y migraciones inspeccionadas conservan los contratos buscados.
- Next.js produce el bundle y la tabla de rutas.
- Las advertencias del build pertenecen a categorías conocidas y explícitamente clasificadas.

## Lo que un verde no demuestra

- Que un navegador haya recorrido A1 → A4.
- Que una petición HTTP real haya pasado autenticación, cookies y middleware.
- Que RLS, grants, triggers o funciones estén instalados en producción exactamente como el SQL del repositorio.
- Que servicios externos como OpenAI, Upstash o Vercel Cron respondan correctamente en producción.

Estas garantías requieren pruebas de integración separadas. `scripts/audit-dtc-live-invariants.sql` contiene las verificaciones de solo lectura usadas para contrastar el estado real de DTCFINAL.

## Regla de lenguaje

No se debe describir un contrato estático como prueba end-to-end. Los reportes deben usar expresiones como:

- “validador ejecutado con fixtures”;
- “wiring verificado por contrato de código”;
- “estado de base confirmado mediante auditoría live”;
- “bundle exitoso con advertencias conocidas”.
