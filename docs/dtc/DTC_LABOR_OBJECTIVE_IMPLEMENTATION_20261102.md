# Objetivo laboral y Radar A4 — implementación local

Fecha: 2 de noviembre de 2026. Base: `9b86077` (incluye el contrato de búsqueda guardada de PR #245).

Esta entrega conecta el objetivo laboral con la entrada temprana, el formulario, el guardado, la recuperación, los filtros, la paginación y las explicaciones de A4. Se integra en dos commits: el primero implementa A4 y la migración; el segundo reutiliza el mismo contrato para la entrada temprana. La migración está versionada para revisión e integración por el responsable de despliegue; este documento no acredita su aplicación remota ni un despliegue de producción.

## Contrato y comportamiento

`lib/opportunities/labor-objective.ts` concentra el contrato validado. Cargo, área funcional y rubro empresarial son listas independientes; dentro de cada lista se admiten alternativas y entre dimensiones se exige la combinación elegida. La etapa `specific` o `exploring` es independiente de la amplitud del cargo. La exploración puede guardarse sin cargos ficticios. Un objetivo específico necesita al menos un cargo o área.

La ubicación comienza en `unspecified`, con ninguna región atribuida. `any` expresa una elección explícita de todas las regiones; `selected` exige una lista no vacía. Las tres situaciones sobreviven al ciclo de parámetros, escritura, lectura y resumen.

La UI conserva el borrador y lo distingue de los filtros aplicados y del objetivo confirmado. Una lectura fallida muestra recuperación y bloquea el reemplazo de lo guardado; no se interpreta como ausencia. Las respuestas tardías no reemplazan ediciones o cambios de vista. «Ver ofertas» no escribe. «Guardar mi objetivo» verifica el contenido devuelto antes de anunciar éxito. Las preferencias avanzadas omitidas —renta, idiomas, seniority y tipos de empleo— se conservan y se muestran como condiciones por revisar en el aviso.

Las etiquetas exactas de áreas heredadas se separan al leer y se presentan para confirmación. El texto ambiguo sigue siendo cargo. Esta compatibilidad no reescribe registros al leer. Las preferencias provenientes de `career_identity_seeded` tampoco se aplican silenciosamente como confirmadas.

## Escritura y concurrencia

`lib/opportunities/objective-api.ts` comparte lector y escritor entre ambos puntos de entrada. La API A4 mantiene sus guardas de sesión y acceso A4. La API temprana exige sesión y acceso piloto. Ambas usan proyección explícita y respuestas privadas sin caché. La escritura exige origen idéntico, `Sec-Fetch-Site` compatible, contenido JSON y un cuerpo de hasta 32 KiB, medido también al leer el stream.

Para modificar la búsqueda principal, el cliente envía `{ id, updatedAt }` de la lectura que conoce. El servidor compara esa revisión y ejecuta un único `UPDATE` con predicados de identidad, propietario, estado y `updated_at`; la ausencia de fila afectada devuelve HTTP 409. No desmarca primero otra búsqueda, no borra registros y no hace `upsert`. Para la primera escritura, `expectedRevision: null` expresa ausencia y el índice único de principal activa decide las altas simultáneas. Una respuesta perdida no dispara una segunda escritura automática.

Los campos omitidos se conservan; antes de actualizar, el objetivo resultante se valida con esos valores existentes. Una selección o exclusión contradictoria no se descarta para ampliar resultados.

## Entrada temprana sin alterar permisos del Radar

`/despega/objetivo-laboral` presenta el objetivo como un paso opcional, con una salida a `/despega/recorrido`. Una persona con objetivo personal puede continuar sin definir un cargo. La página comprueba sesión verificada y acceso piloto antes de mostrar el editor. La integración del enlace opcional en la entrada canónica se coordina en la rama principal del trabajo.

El editor temprano reutiliza el componente con `mode="objective"`. Muestra áreas de la taxonomía y rubros como preferencias, sin consultar el catálogo, presentar resultados, afirmar cobertura o pedir acceso a A4. Un objetivo confirmado existente aparece como resumen editable; al guardar se conserva en la misma fila y contrato que recupera el Radar.

`/api/career/objective` vuelve a comprobar sesión y `resolve_pilot_access`, y entrega al servicio compartido el cliente autenticado. Por tanto, sus consultas y escrituras están sujetas a RLS además de los predicados explícitos de propietario. El cliente administrador sólo resuelve acceso piloto; no se usa para persistir el objetivo temprano. Guardar el objetivo no escribe flags de progreso, requisitos cumplidos ni permisos A4. La API del Radar conserva su guarda independiente.

## Rubro de la empresa y cobertura

El rubro no se deduce del cargo, de palabras en la descripción ni del portal. Un registro pequeño de empleadores directos vincula fuente y board revisados, nombre de empresa, fuente pública, fecha, alcance y próxima revisión. Al leer el índice verificado se agrega esa evidencia; no se añade una clasificación a la tabla de ofertas.

| Empleador directo | Rubro respaldado | Fuente revisada el 2 de noviembre de 2026 |
|---|---|---|
| Fintual | Servicios financieros | [Sitio de Fintual](https://fintual.cl/) |
| Cabify | Transporte y movilidad | [Sitio de Cabify Chile](https://cabify.com/cl) |
| PagerDuty | Tecnología | [Información corporativa de PagerDuty](https://www.pagerduty.com/company/) |

La evidencia vence para este uso el 2 de febrero de 2027 si no se revisa. Se rechaza al no coincidir la empresa, al vencer o al detectar que se está contratando para un cliente no identificado. Todas las demás empresas permanecen por confirmar; este registro no representa clasificación completa del catálogo.

El catálogo informa `known`, `unknown` y `total` dentro de las regiones/modalidades consultadas. El formulario muestra esa cobertura y rotula opciones sin ofertas confirmadas. Una preferencia de rubro puede guardarse aunque no haya cobertura. Si hay preferencias o exclusiones sectoriales, las ofertas desconocidas se excluyen salvo inclusión explícita. Si la persona las incluye, la tarjeta indica la incertidumbre y no afirma coincidencia sectorial.

## Explicaciones y evidencia personal

El clasificador conserva todas las áreas reconocidas en el título. Así, la función financiera de un gerente no desaparece por su nivel jerárquico. La relevancia de cargo exacto, equivalencia revisada y cargo relacionado sigue ordenándose antes de la ampliación de área.

Los filtros expresos se aplican antes de la orientación personal. El CV y la evidencia DTC conservan sus fuentes y naturaleza; sólo aportan apoyo explicativo y desempate dentro de la misma relación con el cargo. La UI presenta «Qué coincide con tu información», «Qué falta confirmar» y «Tu siguiente paso». No hay porcentaje de empleabilidad ni afirmación de competencia demostrada por una autodeclaración.

La revisión de paginación incluye propietario, revisión del objetivo guardado, contexto personal, filtros, inventario y evidencia pública de las tarjetas. No permite añadir páginas de una revisión diferente.

## Migración preparada

Archivo: `supabase/migrations/20261102115220_dtc_labor_objective_completion.sql`, creado previamente por el responsable mediante la CLI oficial y completado en esta rama.

Añade `functional_areas`, `objective_stage`, `unknown_industry_policy` y `location_preference`, y permite `target_roles` vacío sólo en combinación con las nuevas restricciones de objetivo. Retira por su nombre real `career_search_intents_target_roles_check` y lo reemplaza con el límite de ocho elementos. Conserva el índice de principal activa, la RLS de propietario y el trigger de actualización existentes.

El backfill convierte ubicaciones históricas no vacías en `selected` y vacías en `unspecified`; nunca infiere `any`. No reasigna ni separa cargos en base de datos. Este `UPDATE` activa el trigger existente y cambia `updated_at`, por lo que una edición abierta previamente tendrá que recargar su revisión. Antes de aplicar debe comprobarse que no existen listas de cargos mayores que ocho, además de validar la migración y las restricciones en la integración. El despliegue debe coordinar primero el esquema; una API contra un esquema incompleto devuelve un error de disponibilidad y conserva el borrador.

## Verificación ejecutada

Las siguientes pruebas usan fixtures sintéticos y ejecutan las funciones o rutas reales con dependencias de red/base de datos sustituidas. No consultan perfiles ni modifican cuentas reales.

| Prueba | Resultado |
|---|---|
| `test-a4-search-intents.mjs` | 32/32: autorización A4/piloto, propiedad, conservación de preferencias, concurrencia, frontera HTTP y continuidad temprano→A4 |
| `test-saved-search-contract.cjs` | 49/49: contrato importado por los consumidores, todas las dimensiones y confirmación de avanzadas |
| `test-opportunity-search-experience.mjs` | 37/37: API, formulario, borrador/aplicado/guardado, paginación, caso personal integrado y editor/página tempranos |
| `test-opportunity-matching.mjs` | 43/43: filtros, relevancia, clasificación y catálogo |
| `test-opportunity-result-detail.mjs` | 12/12: detalle accesible, texto inerte y fuentes |
| `test-opportunity-personal-detail.mjs` | 16/16: orientación renderizada, procedencia y próximos pasos |
| `test-opportunity-personal-context.mjs` / `test-opportunity-personal-orientation.mjs` | 38/38 y 42/42, respectivamente |
| `test-opportunity-evidence.mjs` / `test-opportunity-diagnostics.mjs` | 40/40 y 9/9, respectivamente |
| `tsc --noEmit --pretty false` | Aprobado |
| `git diff --check` | Aprobado |

El caso integrado positivo usa una oferta ficticia de gerente financiero en una minera ficticia, Biobío e híbrido, con apoyo de CV y un ejercicio DTC A2. Las variantes con región, modalidad, cargo, área o rubro incompatibles quedan fuera. La inclusión explícita de rubro desconocido conserva la incertidumbre. Una negación de experiencia con Excel no produce un apoyo positivo inventado.

No se acredita aquí prueba de base de datos real, revisión visual de navegador ni recorrido en producción. La revisión de React comprobó dependencias estables, cancelación de lecturas y protección de borradores; las pruebas visuales citadas son renderizado estático y comportamiento de componentes.

## Integración pendiente fuera de esta rama

La rama principal coordina el enlace desde la entrada canónica, la prueba de base de datos real, la revisión visual del candidato y el despliegue. En esta rama no se cambian A1, A2 ni A3, ni se relaja la guarda del Radar. Las pruebas de acceso usan dependencias sintéticas; no sustituyen la comprobación de RLS contra Postgres que corresponde a la integración.
