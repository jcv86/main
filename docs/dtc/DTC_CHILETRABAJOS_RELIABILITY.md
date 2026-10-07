# Conexión de Chiletrabajos: corrección y operación

## Alcance

Corrección del adaptador de ofertas, de la selección de oportunidades A4 y del mantenimiento del índice verificado. La base del cambio es el commit de producción `7f56e2599d05edd04890901e17e6d64d7be0fdbb`. La ingesta usa publicaciones públicas de Chiletrabajos; no representa una integración contratada con su API oficial.

## Fallos observados el 7 de octubre de 2026

- La ficha 3666989 respondía HTTP 200, pero DTC extraía ubicación nula y la descripción “PUBLICIDAD”. La publicación tiene ubicación Santiago y contenido laboral completo.
- La búsqueda de contador en Santiago descubría 30 enlaces y terminaba sin resultados aceptados. El formulario público utiliza `2` para el cargo, `13` para el código de ciudad y `f=2`. El adaptador anterior usaba `1` para el cargo y `2` para la ubicación.
- Consulta correcta observada: `https://www.chiletrabajos.cl/encuentra-un-empleo?2=contador&13=1022&f=2`.
- DTCFINAL contenía 66 ofertas verificadas por última vez el 20 de septiembre; ninguna cumplía la ventana de verificación de 24 horas. Las 66 carecían de ubicación, modalidad y descripción. La antigüedad de la verificación no demuestra por sí sola que una oferta haya vencido.
- La modalidad no se aplicaba en la selección final; la búsqueda adicional omitía región. Las siglas directivas se encontraban dentro de palabras ordinarias.

## Lectura y verificación de la fuente

El parser prioriza el bloque `JobPosting` de JSON-LD asociado al ID solicitado. El fallback limita los metadatos y la descripción al aviso principal, interpreta entidades HTML y elimina módulos publicitarios. La fixture reproduce estructura pública observada con contenido sintético; no conserva el aviso íntegro.

Se comprueban HTTPS, dominio del proveedor, ID, canonical y destinos de redirección antes de seguirlos. El transporte limita tamaño, peticiones, redirecciones y tiempo. Un aviso incompleto queda sin verificar y una fecha de vencimiento inválida no se ignora.

Las fechas con hora sin zona se interpretan en `America/Santiago`; se conserva el vencimiento intradía. Una fecha sin hora permanece vigente hasta terminar ese día chileno. La modalidad exige información afirmativa de la publicación; una ubicación física no prueba presencialidad.

El lote comparte una sola respuesta de discovery para candidatos y contadores. Continúa dentro de su presupuesto para obtener resultados aceptados y separa avisos activos, vencidos, mal interpretados, inaccesibles e irrelevantes. Una búsqueda válida sin coincidencias no se etiqueta como caída del proveedor.

## Selección A4

`for-me` y `catalog` conservan autenticación y acceso A4, y realizan únicamente lecturas del índice. Comparten un predicado que mantiene región y modalidad en todas las selecciones.

- Las categorías elegidas se resuelven por clave o etiqueta canónica.
- Las siglas CEO/CFO/COO/CTO requieren palabras completas.
- Una búsqueda precisa por cargo no se amplía a toda su categoría; related usa alternativas explícitas y exploratory admite ampliación acotada.
- Una región elegida requiere ubicación reconocible. Una o dos modalidades elegidas requieren evidencia del modo correspondiente.
- `[]` y el conjunto legado de las tres modalidades significan “Cualquier modalidad”. No asignan un modo ficticio a información desconocida.
- El formulario empieza sin restricción de modalidad y conserva cargos elegidos si el catálogo queda vacío.
- La respuesta distingue índice vacío, ausencia de coincidencias y error de lectura. La interfaz muestra esos estados y presenta las fechas en horario chileno.

## Actualización programada

Ruta: `/api/cron/a4-opportunities`.

Configuración: `15 */3 * * *` en UTC. Seis turnos rotan Santiago, Valparaíso, Concepción, Antofagasta, Puerto Montt y Get on Board; el ciclo completo ocupa 18 horas. La cobertura es una muestra acotada, no todo el inventario de los proveedores.

Cada turno de Chiletrabajos realiza una búsqueda y examina hasta 12 avisos, con 35 segundos de presupuesto y cinco segundos por solicitud. El turno de Get on Board realiza una llamada a su API con ocho segundos de límite y conserva hasta 30 ofertas. El trabajo completo tiene 50 segundos, más tres de finalización, dentro de `maxDuration=60`.

La tarea solo opera con `VERCEL_ENV=production` y Bearer correspondiente a `CRON_SECRET`. En Preview devuelve `NON_PRODUCTION` antes de acceder a proveedor o base de datos. El secreto ya figura configurado en el proyecto; esta corrección no crea credenciales del proveedor ni una suscripción adicional.

El índice exige verificación durante las últimas 24 horas, descarta fechas de verificación futuras y comprueba vencimiento. Los intentos fallidos invalidan únicamente registros identificados, preservan sus metadatos y no avanzan `last_verified_at`. Los errores de escritura se propagan.

### Exclusión de ejecuciones duplicadas

La migración `20261007173326_a4_opportunity_refresh_lease.sql` crea `public.acquire_a4_opportunity_refresh()` y reutiliza `public.cron_job_executions`, sin crear tablas.

La función usa `SECURITY INVOKER`, nombres calificados y `search_path` vacío. Solo `service_role` tiene permiso de ejecución. Un advisory lock protege adquisición e inserción y el registro mantiene un lease de 120 segundos. Un intento consume su turno de tres horas, incluso si falla. El servidor comprueba propiedad antes de persistir y finaliza por ID y estado. Las ejecuciones propias vencidas se registran como fallidas; no se crean notificaciones.

## Validación

Comandos deterministas:

```sh
pnpm run test:a4-opportunities
pnpm exec tsc --noEmit
```

Prueba de migración y concurrencia:

```sh
pnpm run test:a4-opportunity-db
```

La segunda exige `DTC_TEST_DATABASE_URL` local con base exacta `dtc_opportunity_tests`. El workflow A4 crea PostgreSQL 17 efímero y no utiliza datos ni credenciales productivas. Comprueba privilegios efectivos, llamadas concurrentes, duplicados y recuperación de una ejecución vencida.

Las pruebas de parser y matching ejecutan lógica real con fixtures y límites de I/O controlados. No equivalen a una sesión autenticada de navegador. El workflow general conserva typecheck, contratos existentes y build. El workflow A4 ahora se activa cuando cambian adaptadores, endpoints, fixtures, migración o programación.

Los resultados concretos de CI y de las comprobaciones HTTP de la Preview se registran en la PR, asociados al commit validado.

## Puesta en servicio

1. Exigir que pasen las regresiones, la prueba PostgreSQL, typecheck y build del commit a publicar.
2. Aplicar la migración del lease al proyecto correcto antes de activar la versión productiva. La migración por sí sola no ejecuta el cron.
3. Publicar la versión validada y verificar que Vercel acepta la programación.
4. Ejecutar un turno autenticado o esperar el siguiente, y comprobar el registro de ejecución, las fechas de verificación y los contadores. La rotación necesita seis turnos para recorrer sus seis destinos.
5. Comprobar búsqueda y ficha individual; distinguir acceso al proveedor, contenido extraído, coincidencias e inventario persistido.

Endpoints de diagnóstico de lectura: `/api/health/opportunities/chiletrabajos?id=3666989` y `/api/health/opportunities/chiletrabajos-batch?q=contador&location=Santiago`. El primer ID es un ejemplo de validación, no el valor predeterminado del nuevo diagnóstico.

## Fuentes del contrato observado

- [Formulario público de búsqueda](https://www.chiletrabajos.cl/encuentra-un-empleo)
- [Ficha usada para contrastar la extracción](https://www.chiletrabajos.cl/trabajo/3666989)
- [Servicios de integración anunciados por Chiletrabajos](https://www.chiletrabajos.cl/empleadores/)
- [Programación y límites de Cron Jobs en Vercel](https://vercel.com/docs/cron-jobs/usage-and-pricing)

La página de empleadores anuncia servicios mediante API, pero no publica en ella un contrato abierto de lectura del catálogo completo. Este cambio no afirma que DTC disponga de ese acceso.
