# Continuidad de evidencia A1 → A2

Fecha: 2 de noviembre de 2026.

## Problema corregido

La introducción de A2 convertía las puntuaciones netas DISC a valores absolutos,
las normalizaba como porcentajes y las presentaba con otros nombres. Una elección
neta positiva y una negativa del mismo tamaño adquirían el mismo peso. También
se elegía una dimensión dominante al ordenar empates, aunque el informe A1 ya
conservaba la ambigüedad.

El recorrido antiguo `/despega/a2/camino` asignaba un camino a partir de DISC y
dividía por la suma de sus cuatro valores. Esa suma es cero para el algoritmo
MÁS/MENOS. Otra página antigua, `/despega/a2/recomendaciones`, imputaba 50 cuando
faltaban puntuaciones y mostraba porcentajes de compatibilidad sin calibración.

## Resultado

- La introducción lee `loadA1Report`, el mismo lector canónico del informe.
- `lib/a2/a1-orientation.ts` proyecta solamente el objetivo, disponibilidad,
  respuestas por situación, incertidumbre y aclaraciones vigentes que usa la UI.
- Se conservan las elecciones MÁS y MENOS sin convertirlas en porcentajes,
  capacidades o elegibilidad para un camino/carrera.
- Los empates, incluidos todos los valores netos en cero, pueden continuar.
- Un histórico compatible sin respuestas originales conserva el contexto, sin
  reconstruir ejemplos personales. Las respuestas históricas completas sin
  metadatos pasan por la validación canónica.
- Las aclaraciones de otra revisión o malformadas no se muestran como actuales.
  El desacuerdo del usuario y la opción de no aportar un ejemplo se conservan.
- Los datos faltantes o incompatibles se revisan en A1; no se sustituyen por ceros.
- No se modifica el algoritmo del cuestionario, ninguna respuesta, la estructura
  de la base de datos, los desbloqueos, ni las misiones.

## Compatibilidad del recorrido antiguo

Las páginas `/despega/a2/camino` y `/despega/a2/recomendaciones` conservan sus URLs
y redirigen al puente autenticado `/despega/a2-routes`, que resuelve el paso actual.
El componente antiguo ofrece el mismo acceso sin puntajes ni selección por DISC.

`GET /api/a2/route-recommendation` se retira explícitamente:

| Condición | HTTP | Respuesta |
| --- | --- | --- |
| Sesión ausente | 401 | Error de autenticación |
| Sesión verificada | 410 | `disc_route_recommendation_retired` y `nextPath` al puente canónico |
| Error al verificar sesión | 503 | Error genérico sin detalles del proveedor |

Todas las respuestas usan `Cache-Control: private, no-store`. El endpoint ya no
consulta la tabla antigua ni produce una recomendación. Los consumidores externos
que pudieran conservarlo deben usar `nextPath`; la navegación de la aplicación
actual ya no lo llama. Los helpers exportados se conservan como adaptadores
obsoletos con recomendación y confianza nulas; no simulan un cero por ciento.

## Verificación

Ejecutar:

```sh
node --import tsx scripts/test-a1-a2-orientation.cjs
node --import tsx scripts/check-a1-a2-a3-journey-contract.ts
node --import tsx scripts/check-a1-individual-understanding-contract.ts
node --import tsx scripts/check-dtc-credibility-contract.ts
```

La prueba nueva cubre signo, empates principales/secundarios, ceros, registros
históricos, ausencia, datos inválidos, incompatibilidad de versión, discrepancias
entre respuesta y puntuación, aclaraciones vigentes/obsoletas, SSR real, escape
de texto, identidad verificada, redirecciones y retiro del endpoint. Autenticación
y lectura de datos se sustituyen por dobles de prueba: esto no acredita un
recorrido autenticado desplegado, una revisión visual del navegador ni eficacia
psicométrica. No escribe datos reales.
