# Integridad de outcomes — candidato de captura, 14 de octubre de 2026

Estado: **código preparado; ejecución de pruebas bloqueada; NO APTO PARA FUSIÓN NI PUBLICACIÓN todavía**.
Base: `jcv86/main` en `3de1cbfc5b3147ad0f6ee109742ccb06728e5cda`.

## Resultado de este bloque

Preparar una corrección del guardado A1–A3 y dejar de tratar las reglas de longitud/palabras como evidencia de mejora. La nueva captura conserva respuestas del propietario, sin nota ni confianza fabricada. No implementa todavía un instrumento de evaluación validado ni demuestra outcomes de clientes.

### Cambios de código preparados

- Un contrato compartido de respuestas reemplaza las validaciones duplicadas de A1. Espacios, tabulaciones y saltos de línea se interpretan como separadores. Los mínimos de palabras son límites del formulario, no una rúbrica de capacidad.
- Los formularios A1/A2/A3 reutilizan un componente de captura. No calculan ni envían puntajes, dimensiones, confianza o identificadores de usuario.
- La API verifica sesión, formato, origen cuando se informa, tamaño, identidad del instrumento y preguntas esperadas. La identidad del propietario procede de la sesión.
- Cada captura usa `2-capture`, separada de la versión histórica `1`. Clientes antiguos reciben una respuesta 409 para recargar, sin escribir el puntaje que enviaron.
- Los registros nuevos tienen `score`, escalas y `confidence` nulos y dimensiones vacías. Las referencias de evidencia se construyen en el servidor sobre la propia captura.
- No se calculan diferencias numéricas ni se actualizan los snapshots v1. No se eliminan, reescriben o reinterpretan masivamente respuestas históricas.
- Un UUID por envío permite reconocer un reintento idéntico. Su comprobación usa la sesión del propietario, filtros explícitos y RLS. Una colisión con otro contenido no reemplaza registros.
- El resultado visible dice «registradas, pendientes de evaluación», muestra el texto recién enviado y una siguiente acción ligada a la etapa. Continuar es una acción separada del guardado.
- Los errores de red conservan las respuestas en el formulario mientras permanezca abierto. No se prometen persistencia del borrador tras recargar ni una recuperación histórica que este bloque no implementa.

## Alcance y compatibilidad

No hay migración en este candidato. La migración versionada de outcomes admite scores/escalas/confianza nulos y versiones textuales; la existencia de `response_payload` fue observada en el esquema durante la revisión anterior. Antes de desplegar debe reconfirmarse la compatibilidad exacta mediante un entorno permitido y ensayarse con Auth/RLS reales aislados.

Los evaluadores heurísticos v1 y su tarjeta quedan como código histórico, sin llamadas desde los tres formularios activos de esta propuesta. No deben reutilizarse como validación de capacidades. Los snapshots v1 no constituyen una nueva evidencia de mejora y requieren una política de tratamiento histórico antes de alimentar analítica de efectividad.

Este cambio modifica la experiencia: se retiran temporalmente las notas automáticas de ese recorrido, no se reemplazan por otra supuesta medición válida. La evaluación con rúbrica, antes/después recuperable, revisión/calibración independiente, panel de resultados y piloto siguen pendientes.

## Evidencia disponible y bloqueo

Se verificó la base remota y se creó un entorno temporal aislado con esa revisión, sin credenciales de base de datos ni dominios de producción permitidos en su red. La instalación del lockfile terminó correctamente, con scripts de instalación deshabilitados.

El primer intento de reproducción se detuvo por incompatibilidad de importación ESM/CommonJS, antes de ejecutar el escenario de A1. La siguiente llamada de ejecución fue bloqueada por la herramienta con el mensaje «OpenAI bloqueó esta llamada a la herramienta al no poder determinar el estado de seguridad de la solicitud».

No se reprodujo el defecto en ejecución. No se repitió esa ejecución por otra vía. El entorno temporal se detuvo y el cierre quedó confirmado; su persistencia estaba deshabilitada. La preparación posterior consiste en autoría estática de código, sin ejecutar las pruebas bloqueadas.

**No se han ejecutado TypeScript, compilación, regresiones, prueba visual o recorrido autenticado sobre este candidato.** No atribuirle las pruebas históricas de A4 ni un efecto en producción. Cualquier comprobación automática de la integración Git debe identificarse por separado y no equivale a validar el flujo completo.

## Puerta de aceptación pendiente

1. Probar guardado de respuestas normales de A1, A2 y A3 con caracteres españoles, espacios, tabulaciones y saltos de línea.
2. Comprobar rechazo de campos de puntuación, usuario, fechas y evidencia ajena; instrumento incompatible; claves faltantes/extra; longitud/tamaño excesivo y JSON inválido.
3. Probar 401, origen cruzado, errores de sesión, errores de escritura, respuestas inválidas y JSON de error privado sin contenido personal.
4. Probar reintento idéntico, mismo UUID/contenido distinto y colisión entre propietarios, con RLS real y sin acceso ajeno.
5. Verificar que no se generen scores, confianza numérica, deltas ni sobrescritura de snapshots históricos.
6. Probar doble clic, timeout, error de red, conservación del borrador, guardado confirmado, navegación explícita y desmontaje del componente.
7. Ejecutar TypeScript, los contratos generales, la compilación y las pruebas de acceso. Revisar los contratos históricos de outcomes que esperan puntajes v1: no eliminarlos para ocultar regresiones; sustituirlos por contratos conductuales acordes a la nueva semántica.
8. Revisar teclado, lector de pantalla y 390 px/desktop. Verificar que los tres recorridos existentes conserven sus guardas y la continuidad tras pulsar Continuar.
9. Aceptar explícitamente el retiro de notas heurísticas, completar revisión independiente y verificar un candidato aislado antes de considerar la fusión.

## Siguiente hito de producto

Construir la evaluación confiable de evidencia comparable y llevarla a una muestra de usuarios reales, separando entrega, mejora de capacidad y resultado laboral externo. El éxito del presente bloque es la integridad del registro, no un aumento de la efectividad demostrada de DTC.

Documentación técnica consultada: https://nextjs.org/docs/app/guides/authentication (validación y autorización en el servidor). Su consulta no prueba la corrección de este candidato.
