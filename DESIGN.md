# DTC DESIGN SYSTEM

> Documento rector de diseño, experiencia y construcción visual de DespegaTuCarrera.
>
> Versión: 2.0  
> Estado: Canónico  
> Tipografía principal: Montserrat  
> Alcance: landing, autenticación, onboarding, A1, A2, A3, A4, dashboard, Career Identity, gamificación, administración y futuras experiencias.

---

## 0. Propósito

Este documento define cómo debe verse, sentirse y comportarse DespegaTuCarrera. No es una colección de preferencias visuales: es el contrato que debe respetar toda nueva pantalla, componente, ilustración, animación, mensaje, flujo y experimento.

DTC debe sentirse como un mentor ejecutivo digital: inteligente, sereno, preciso, humano y exigente. La experiencia debe transmitir progreso profesional sin caer en estética infantil, corporativa genérica, edtech saturada ni apariencia de chatbot improvisado.

Toda implementación debe cumplir tres condiciones:

1. Reconocible como DTC sin depender del logotipo.
2. Coherente entre A1, A2, A3 y A4.
3. Comprensible y usable antes de ser decorativa.

---

# 1. Idea rectora

## 1.1 Posicionamiento visual

DTC no es un curso, una bolsa de trabajo ni un test aislado. Es un sistema operativo de desarrollo profesional.

La interfaz debe expresar:

- claridad frente a la incertidumbre;
- progreso frente al estancamiento;
- evidencia frente a la opinión;
- acompañamiento frente al abandono;
- sofisticación sin frialdad;
- tecnología sin espectáculo innecesario.

## 1.2 Personalidad

| Rasgo | Debe sentirse como | Nunca como |
|---|---|---|
| Inteligente | Preciso, contextual y explicable | Pretencioso o críptico |
| Premium | Espacioso, silencioso y cuidado | Lujo ostentoso |
| Humano | Cercano, respetuoso y directo | Infantil o condescendiente |
| Profesional | Confiable y orientado a resultados | Banco tradicional o intranet |
| Tecnológico | Actual, rápido y adaptativo | Neón, cyberpunk o demo de IA |
| Motivador | Progreso visible y accionable | Medallas, confeti y presión artificial |

## 1.3 Principios de diseño

### Claridad antes que densidad

Cada pantalla debe tener una acción principal inequívoca. Si el usuario debe decidir entre muchas acciones, se debe revelar complejidad progresivamente.

### Evidencia antes que promesa

Los resultados, scores y recomendaciones deben explicar su origen, nivel de confianza y siguiente acción. Nunca presentar inferencias como verdades absolutas.

### Progreso antes que gamificación

La motivación se construye mostrando evolución, consistencia, práctica y desbloqueos relevantes. XP y logros son secundarios.

### Calma antes que estímulo

No usar múltiples gradientes, animaciones simultáneas, colores por todas partes ni componentes compitiendo por atención.

### Un producto, cuatro pilares

A1–A4 comparten el mismo sistema visual. El color de cada pilar sólo funciona como señal contextual secundaria.

### Accesibilidad por defecto

Contraste, foco, navegación por teclado, targets táctiles, jerarquía y mensajes de error son requisitos, no mejoras posteriores.

---

# 2. Arquitectura visual

La identidad visual se organiza en cinco capas:

1. **Foundation:** color, tipografía, espaciado, radios, sombras y motion.
2. **Primitives:** texto, icono, divisor, superficie y control.
3. **Components:** botones, inputs, cards, tablas, tabs, dialogs y feedback.
4. **Patterns:** onboarding, evaluación, dashboard, misión, conversación IA y resultados.
5. **Experiences:** landing, A1, A2, A3, A4 y Career Identity.

Ninguna experiencia puede crear tokens propios si una capa inferior ya resuelve la necesidad.

---

# 3. Sistema de color

## 3.1 Dirección cromática

La nueva paleta abandona los primarios saturados y el negro absoluto como base universal. DTC utilizará un sistema oscuro premium con superficies azul grafito, texto marfil y un índigo sofisticado como color de marca.

La paleta debe comunicar confianza, inteligencia, evolución y profundidad.

## 3.2 Paleta base oscura

| Token | Hex | Uso |
|---|---:|---|
| `ink-950` | `#080B14` | Fondo raíz de la aplicación |
| `ink-900` | `#0D1220` | Fondo elevado y navegación |
| `ink-850` | `#121827` | Superficie principal |
| `ink-800` | `#182033` | Card elevada, hover y panel |
| `ink-700` | `#263149` | Bordes fuertes y controles activos |
| `ink-600` | `#3B4863` | Bordes, divisores y estados disabled |
| `stone-50` | `#F7F5F0` | Texto principal cálido |
| `stone-200` | `#DDD9D0` | Texto secundario |
| `stone-400` | `#A7A39B` | Texto muted |
| `stone-600` | `#716F6A` | Placeholder y disabled |

No usar `#000000` como fondo principal ni `#FFFFFF` como texto universal. Ambos pueden reservarse para casos puntuales.

## 3.3 Marca principal

| Token | Hex | Uso |
|---|---:|---|
| `indigo-300` | `#A8B4FF` | Texto o icono sobre fondos oscuros |
| `indigo-400` | `#7E8DFF` | Estados activos y visualización |
| `indigo-500` | `#5C6FF0` | Primario DTC |
| `indigo-600` | `#4658D4` | Hover primario |
| `indigo-700` | `#3544A8` | Pressed y fondos tonales |
| `indigo-glow` | `rgba(92,111,240,.22)` | Resplandor controlado |

El índigo representa inteligencia, dirección y transformación. No se combina con más de un color de acento fuerte en una misma vista.

## 3.4 Acento humano

| Token | Hex | Uso |
|---|---:|---|
| `teal-300` | `#79D5C8` | Datos positivos y elementos destacados |
| `teal-500` | `#2FAF9E` | Progreso, crecimiento y éxito |
| `teal-700` | `#18776D` | Fondos tonales y pressed |

El teal no reemplaza el color de éxito semántico en todos los contextos; funciona además como acento humano y de progreso.

## 3.5 Acento de logro

| Token | Hex | Uso |
|---|---:|---|
| `amber-300` | `#F8D58A` | Highlights y badges premium |
| `amber-500` | `#D99B32` | Hitos, streaks y logros |
| `amber-700` | `#93631C` | Fondos tonales |

El amber se usa con moderación. Nunca debe teñir grandes superficies ni ser el color principal de una pantalla.

## 3.6 Colores semánticos

| Estado | Base | Fondo tonal | Texto |
|---|---:|---:|---:|
| Success | `#2FAF9E` | `#102C2A` | `#A6E5DC` |
| Warning | `#D99B32` | `#302514` | `#F2D69D` |
| Error | `#E0656F` | `#32181D` | `#F4B1B7` |
| Info | `#5C8FEF` | `#14233D` | `#B4CCFA` |

No usar color como único canal de comunicación. Todo estado requiere icono, texto o etiqueta.

## 3.7 Identidad de pilares

Los pilares mantienen acentos discretos, nunca temas completos independientes.

| Pilar | Acento | Hex | Significado |
|---|---|---:|---|
| A1 Despega Cerebral | Violet | `#9B7CF6` | Autoconocimiento |
| A2 Tu Ruta | Indigo | `#5C6FF0` | Dirección y ejecución |
| A3 Entrenamiento | Coral | `#E7836F` | Práctica y exposición |
| A4 Radar Estratégico | Teal | `#2FAF9E` | Contexto y realidad |

Reglas:

- El acento puede aparecer en una barra lateral de 3 px, badge, icono, gráfico o progreso.
- No cambiar el fondo general por pilar.
- No crear botones primarios distintos por módulo.
- No usar dos acentos de pilar en una misma card.

## 3.8 Gradientes

Permitidos sólo en:

- hero principal;
- fondos de onboarding;
- visualización de Career Identity;
- estados especiales de logro.

Gradiente de marca recomendado:

```css
background: linear-gradient(135deg, #5C6FF0 0%, #7A5CE5 52%, #2FAF9E 120%);
```

Nunca usar gradientes arcoíris, más de tres stops o gradientes dentro de texto largo.

## 3.9 Contraste

- Texto normal: mínimo WCAG AA 4.5:1.
- Texto grande: mínimo 3:1.
- Controles y bordes importantes: mínimo 3:1.
- Texto muted nunca debe reemplazar información esencial.

---

# 4. Tipografía

## 4.1 Familia principal

**Montserrat** es la única familia tipográfica de producto.

```css
font-family: 'Montserrat', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

Pesos permitidos:

- 400 Regular: cuerpo y descripciones.
- 500 Medium: navegación, botones y cifras.
- 600 Semibold: títulos pequeños, labels y énfasis.
- 700 Bold: titulares y métricas principales.

No usar 800 o 900 salvo una campaña visual excepcional aprobada.

## 4.2 Escala tipográfica

| Token | Desktop | Mobile | Weight | Line-height | Uso |
|---|---:|---:|---:|---:|---|
| `display-xl` | 72 | 44 | 700 | .98 | Hero de marca |
| `display-lg` | 56 | 38 | 700 | 1.02 | Hero interior |
| `heading-xl` | 40 | 32 | 700 | 1.08 | Título de página |
| `heading-lg` | 32 | 28 | 700 | 1.12 | Sección principal |
| `heading-md` | 24 | 22 | 600 | 1.2 | Card o subsección |
| `heading-sm` | 18 | 18 | 600 | 1.3 | Componentes |
| `body-lg` | 18 | 17 | 400 | 1.65 | Intro y contenido importante |
| `body-md` | 16 | 16 | 400 | 1.6 | Cuerpo base |
| `body-sm` | 14 | 14 | 400 | 1.55 | Apoyo y metadata |
| `label` | 12 | 12 | 600 | 1.3 | Inputs y tags |
| `caption` | 11 | 11 | 500 | 1.4 | Timestamps y auxiliares |

## 4.3 Tracking

- Display: entre `-0.035em` y `-0.02em`.
- Headings: entre `-0.02em` y `-0.01em`.
- Body: `0`.
- Labels en mayúscula: máximo `0.08em`; evitar el tracking exagerado actual.

## 4.4 Longitud de línea

- Texto editorial: 55–72 caracteres.
- Texto de card: máximo 52 caracteres.
- Hero: máximo 18 palabras en el titular.
- Párrafos de onboarding: máximo cuatro líneas en desktop y seis en mobile.

## 4.5 Jerarquía

Una pantalla no debe tener más de un `h1`. No usar tamaño tipográfico para reemplazar estructura semántica.

---

# 5. Espaciado y layout

## 5.1 Escala base

El sistema usa base de 4 px.

```text
0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128
```

Tokens:

```css
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-8: 32px;
--space-10: 40px;
--space-12: 48px;
--space-16: 64px;
--space-20: 80px;
--space-24: 96px;
--space-32: 128px;
```

No usar valores arbitrarios salvo cálculo responsivo documentado.

## 5.2 Contenedores

| Contexto | Máximo |
|---|---:|
| Lectura / formulario | 720 px |
| Dashboard principal | 1200 px |
| Data-heavy / admin | 1440 px |
| Hero | 1280 px |

Padding horizontal:

- 320–479: 20 px.
- 480–767: 24 px.
- 768–1023: 32 px.
- 1024+: 40 px.

## 5.3 Grid

- Desktop: 12 columnas.
- Tablet: 8 columnas.
- Mobile: 4 columnas.
- Gutter: 24 px desktop, 20 px tablet, 16 px mobile.

## 5.4 Densidad

DTC utiliza densidad media-baja. Las cards no deben parecer hojas de cálculo salvo vistas administrativas.

---

# 6. Radios, bordes y sombras

## 6.1 Radios

| Token | Valor | Uso |
|---|---:|---|
| `radius-sm` | 8 px | tags, chips, controles compactos |
| `radius-md` | 12 px | inputs y botones |
| `radius-lg` | 16 px | cards y panels |
| `radius-xl` | 24 px | hero cards y dialogs |
| `radius-pill` | 999 px | badges y toggles |

El radio global no debe ser 20 px para todo. Cada escala tiene función.

## 6.2 Bordes

- Base: `1px solid rgba(167,163,155,.16)`.
- Strong: `rgba(167,163,155,.28)`.
- Active: `rgba(126,141,255,.65)`.
- Error: `rgba(224,101,111,.72)`.

No usar bordes teal universales.

## 6.3 Sombras

```css
--shadow-sm: 0 1px 2px rgba(0,0,0,.24);
--shadow-md: 0 8px 24px rgba(0,0,0,.24);
--shadow-lg: 0 20px 60px rgba(0,0,0,.32);
--shadow-focus: 0 0 0 4px rgba(92,111,240,.22);
```

Las sombras indican elevación, no decoración. Una card base puede no tener sombra.

---

# 7. Iconografía e imágenes

## 7.1 Iconos

Sistema principal: Lucide.

- Stroke estándar: 1.75 px.
- Tamaños: 16, 20, 24 y 32 px.
- Iconos decorativos deben tener `aria-hidden`.
- Iconos funcionales requieren label accesible.
- No mezclar iconos filled, emojis e iconos outline en una misma vista.

## 7.2 Fotografía

La fotografía debe mostrar personas reales en contextos profesionales contemporáneos, evitando:

- poses de stock corporativo;
- oficinas excesivamente perfectas;
- diversidad utilizada como decoración superficial;
- manos estrechándose;
- personas apuntando a gráficos invisibles.

Preferir escenas íntimas, concentración, conversación, preparación y transición.

## 7.3 Ilustración

Las ilustraciones deben ser abstractas, geométricas y suaves. Usar grafos, rutas, capas, señales y evolución. No usar personajes caricaturescos ni cerebros con circuitos.

---

# 8. Motion system

## 8.1 Principios

El movimiento explica relación, jerarquía y cambio de estado. Nunca debe retrasar la tarea.

## 8.2 Duraciones

| Token | Duración | Uso |
|---|---:|---|
| `motion-fast` | 120 ms | hover, icono, toggle |
| `motion-base` | 180 ms | botones, tabs, tooltip |
| `motion-slow` | 260 ms | panel, dialog, accordion |
| `motion-page` | 360 ms | transición de etapa o logro |

## 8.3 Easing

```css
--ease-standard: cubic-bezier(.2,.8,.2,1);
--ease-enter: cubic-bezier(.16,1,.3,1);
--ease-exit: cubic-bezier(.4,0,1,1);
```

## 8.4 Reglas

- Hover: máximo 2 px de desplazamiento.
- Escala de botones: entre .98 y 1.01.
- No usar animaciones infinitas salvo indicadores de proceso.
- Respetar `prefers-reduced-motion`.
- No animar grandes bloques al hacer scroll por defecto.

---

# 9. Componentes fundamentales

## 9.1 Botones

### Variantes

- Primary: acción principal única.
- Secondary: acción importante alternativa.
- Ghost: navegación o acción de baja jerarquía.
- Destructive: operación irreversible.
- Link: navegación contextual.

### Alturas

- Small: 36 px.
- Medium: 44 px.
- Large: 52 px.

### Reglas

- Máximo un botón primary visible por zona de decisión.
- Texto en verbo + resultado: `Comenzar diagnóstico`, no `Continuar` cuando sea posible.
- Loading conserva ancho y reemplaza icono, no todo el texto.
- Disabled debe explicar por qué mediante texto cercano o tooltip.

## 9.2 Inputs

- Altura base: 48 px.
- Label siempre visible; placeholder no reemplaza label.
- Helper text separado de error.
- Error debe indicar cómo corregirlo.
- Autofill y password manager deben funcionar.
- Focus ring índigo de 4 px con offset visual interno.

## 9.3 Cards

Una card debe tener propósito claro: agrupación, decisión, estado o resumen. No envolver todo en cards.

Tipos:

- Surface card.
- Interactive card.
- Metric card.
- Mission card.
- Evidence card.
- AI insight card.

La card interactiva debe mostrar hover y foco equivalentes.

## 9.4 Badges

Badges expresan estado, categoría o nivel. No deben reemplazar títulos ni contener frases largas.

## 9.5 Progress

Todo progreso debe indicar:

- valor actual;
- meta o contexto;
- próximo paso;
- fuente cuando corresponda.

No mostrar porcentajes falsamente precisos.

## 9.6 Dialogs

- Anchura estándar: 480–640 px.
- No usar dialog para flujos extensos.
- Escape y click exterior deben cerrar salvo operación crítica.
- Foco se captura y restaura correctamente.

## 9.7 Toasts

Usar sólo para confirmaciones no críticas. Errores que requieren acción permanecen visibles en la pantalla.

---

# 10. Patrones de experiencia

## 10.1 Landing

La landing debe comunicar en este orden:

1. Problema humano reconocible.
2. Promesa concreta de transformación.
3. Cómo funciona el sistema.
4. Evidencia y confianza.
5. CTA principal.

Evitar enumerar funcionalidades antes de explicar valor.

## 10.2 Onboarding

- Mostrar progreso por etapas, no número de preguntas pendientes cuando genere ansiedad.
- Permitir guardar y continuar.
- Explicar por qué se solicita información sensible.
- No pedir datos que no cambien la experiencia.

## 10.3 Evaluaciones A1

- Una decisión por pantalla en mobile.
- Pregunta siempre visible.
- Estado de selección inequívoco.
- No usar colores de éxito/error en respuestas sin respuesta correcta.
- Permitir revisar antes de enviar.

## 10.4 Misiones A2

Cada misión debe mostrar:

- propósito;
- duración estimada;
- impacto esperado;
- evidencia requerida;
- habilidad u objetivo relacionado;
- estado y siguiente acción.

## 10.5 Entrenamiento A3

La interfaz debe reducir ansiedad:

- preparación antes de iniciar;
- permisos claros;
- modo texto equivalente;
- indicador de grabación evidente;
- feedback dividido en fortalezas, oportunidad y próxima práctica;
- nunca usar lenguaje humillante o absoluto.

## 10.6 Radar A4

Diferenciar explícitamente:

- señal;
- interpretación;
- relevancia personal;
- acción sugerida;
- fecha y fuente.

La cantidad de noticias nunca debe ser la métrica principal de valor.

## 10.7 Career Identity

Debe sentirse como un perfil vivo, no como un dashboard técnico.

Orden recomendado:

1. Resumen de identidad actual.
2. Objetivos activos.
3. Fortalezas con evidencia.
4. Áreas en desarrollo.
5. Evolución temporal.
6. Próximas acciones.

Scores incluyen confianza y evidencia. Nunca usar radar charts como única visualización.

---

# 11. Interacción con IA

## 11.1 Presencia

La IA se presenta como capacidad integrada, no como mascota omnipresente. Debe estar visible cuando está analizando, comparando, sintetizando o generando.

## 11.2 Estados

- Preparando contexto.
- Analizando evidencia.
- Construyendo respuesta.
- Resultado listo.
- No fue posible completar.

Evitar mensajes falsos como `Pensando profundamente` si no representan un proceso real.

## 11.3 Respuestas

Toda respuesta debe priorizar:

1. conclusión clara;
2. evidencia usada;
3. implicación;
4. siguiente acción.

## 11.4 Confianza

Cuando una inferencia tenga evidencia limitada, usar lenguaje proporcional:

- `Hay señales iniciales de...`
- `La evidencia disponible sugiere...`
- `Todavía necesitamos más práctica para concluir...`

## 11.5 Controles

El usuario debe poder:

- corregir información;
- indicar que una recomendación no aplica;
- ver qué datos influyeron;
- regenerar con contexto adicional;
- eliminar información cuando corresponda.

---

# 12. Gamificación elegante

## 12.1 Qué se premia

- consistencia;
- práctica verificada;
- reflexión;
- evidencia;
- mejora;
- finalización significativa.

## 12.2 Qué no se premia

- abrir páginas;
- hacer click repetidamente;
- consumir contenido sin evidencia;
- completar acciones triviales para obtener XP.

## 12.3 Presentación

- XP es secundario.
- Los logros usan amber controlado.
- No usar cofres, monedas, gemas ni confeti por defecto.
- Celebraciones importantes pueden usar motion breve y sonido sólo con consentimiento.

---

# 13. Responsive

## 13.1 Breakpoints de referencia

```text
320, 375, 390, 430, 768, 1024, 1280, 1440, 1920
```

## 13.2 Mobile first

En mobile:

- una columna principal;
- CTA fijo sólo cuando aporta valor;
- tablas se transforman en cards o vistas resumidas;
- navegación inferior máxima de cinco destinos;
- dialogs complejos se convierten en sheets de pantalla completa;
- targets mínimos de 44 × 44 px.

## 13.3 Desktop

Desktop no significa llenar espacio. Mantener límites de lectura y usar columnas laterales para contexto, no para decoración.

---

# 14. Accesibilidad

Requisitos obligatorios:

- HTML semántico.
- Jerarquía correcta de headings.
- Navegación completa por teclado.
- Focus visible persistente.
- Skip link.
- Labels programáticos.
- Mensajes de error asociados al campo.
- `aria-live` para procesos y resultados dinámicos.
- Contraste AA como mínimo.
- Soporte de zoom al 200%.
- `prefers-reduced-motion`.
- No bloquear orientación ni escalado.
- Cámara y micrófono nunca son la única vía de completar una tarea.

---

# 15. Estados universales

Todo componente con datos debe definir:

1. Loading.
2. Empty.
3. Partial.
4. Success.
5. Error.
6. Retry.
7. Offline.
8. Permission denied.

## Loading

Usar skeleton sólo cuando refleje la estructura final. Para procesos de IA, indicar etapa real y permitir cancelar cuando sea viable.

## Empty

Debe explicar:

- qué aparecerá;
- por qué aún no existe;
- qué acción lo crea.

## Error

Debe incluir:

- qué ocurrió;
- qué se conservó;
- qué puede hacer el usuario;
- identificador de soporte cuando corresponda.

---

# 16. Voz y microcopy

## 16.1 Voz

DTC habla con claridad, respeto y convicción. No aconseja desde superioridad; ayuda a observar, interpretar y actuar.

## 16.2 Reglas

- Español chileno neutro, sin modismos forzados.
- Usar `trabajo`, no `pega`.
- Frases breves.
- Evitar jerga técnica en UI.
- No prometer resultados laborales.
- No diagnosticar psicológicamente.
- No usar signos de exclamación repetidos.
- No infantilizar con emojis.

## 16.3 CTAs

Preferir:

- `Comenzar diagnóstico`.
- `Revisar mi evidencia`.
- `Entrenar esta respuesta`.
- `Construir mi ruta`.
- `Ver siguiente misión`.

Evitar:

- `Enviar`.
- `OK`.
- `Haz clic aquí`.
- `Continuar` sin contexto.

---

# 17. Tokens canónicos

Ejemplo de implementación CSS:

```css
:root {
  --dtc-bg: #080B14;
  --dtc-surface-1: #0D1220;
  --dtc-surface-2: #121827;
  --dtc-surface-3: #182033;

  --dtc-text: #F7F5F0;
  --dtc-text-secondary: #DDD9D0;
  --dtc-text-muted: #A7A39B;

  --dtc-primary: #5C6FF0;
  --dtc-primary-hover: #4658D4;
  --dtc-primary-soft: rgba(92,111,240,.16);

  --dtc-progress: #2FAF9E;
  --dtc-achievement: #D99B32;
  --dtc-error: #E0656F;
  --dtc-warning: #D99B32;
  --dtc-info: #5C8FEF;

  --dtc-border: rgba(167,163,155,.16);
  --dtc-border-strong: rgba(167,163,155,.28);

  --dtc-radius-sm: 8px;
  --dtc-radius-md: 12px;
  --dtc-radius-lg: 16px;
  --dtc-radius-xl: 24px;

  --dtc-shadow-sm: 0 1px 2px rgba(0,0,0,.24);
  --dtc-shadow-md: 0 8px 24px rgba(0,0,0,.24);
  --dtc-shadow-lg: 0 20px 60px rgba(0,0,0,.32);
}
```

Tailwind, shadcn y CSS Modules deben mapear a estos tokens. No usar hex directos dentro de componentes.

---

# 18. Reglas de código

- Usar componentes compartidos antes de crear variantes locales.
- No hardcodear colores, sombras o radios.
- No introducir otra fuente.
- No usar clases arbitrarias si existe token.
- No duplicar lógica responsive.
- Cada componente interactivo debe tener hover, focus, active, disabled y loading.
- Storybook o catálogo equivalente debe documentar componentes críticos.
- Nuevos patrones requieren actualización de este documento.

---

# 19. Anti-patrones prohibidos

- Negro absoluto como superficie universal.
- Azul `#0000FF`, morado `#8000FF` o colores primarios puros.
- Un color de fondo distinto por pilar.
- Gradientes multicolor sin función.
- Glassmorphism en todas las cards.
- Sombras grandes en componentes pequeños.
- Más de una tipografía de producto.
- Títulos completos en mayúsculas.
- Labels con tracking excesivo.
- Botones con estilos únicos por pantalla.
- Emojis como iconografía principal.
- Animaciones infinitas decorativas.
- Scores sin explicación.
- Mensajes de IA que simulan certeza.
- Cards dentro de cards sin jerarquía clara.
- Texto gris de bajo contraste.
- CTA genéricos.
- Estados vacíos sin próxima acción.

---

# 20. Checklist de revisión

Antes de aprobar una pantalla:

## Marca

- ¿Se reconoce como DTC sin el logo?
- ¿Usa Montserrat correctamente?
- ¿Respeta la paleta y tokens?

## Jerarquía

- ¿Existe una acción principal clara?
- ¿El contenido más importante aparece primero?
- ¿La densidad es adecuada?

## Componentes

- ¿Se reutilizan componentes canónicos?
- ¿Todos los estados están definidos?
- ¿No hay valores visuales arbitrarios?

## Responsive

- ¿Funciona a 320, 390, 768, 1024 y 1440 px?
- ¿No existe scroll horizontal accidental?
- ¿Los targets táctiles cumplen 44 px?

## Accesibilidad

- ¿Contraste AA?
- ¿Teclado y foco?
- ¿Labels y errores asociados?
- ¿Reduced motion?

## IA y evidencia

- ¿La respuesta explica su base?
- ¿La confianza está representada adecuadamente?
- ¿El usuario puede corregir o rechazar la inferencia?

## Lenguaje

- ¿Es claro y profesional?
- ¿Evita promesas o diagnósticos?
- ¿La CTA describe el resultado?

---

# 21. Plan de migración visual

La aplicación no debe rediseñarse con un reemplazo masivo de una sola vez. Orden recomendado:

1. Crear tokens canónicos y compatibilidad temporal.
2. Actualizar tipografía y fundamentos globales.
3. Migrar Button, Input, Card, Badge, Dialog y Progress.
4. Rediseñar navegación y shell de aplicación.
5. Migrar landing y autenticación.
6. Migrar dashboard y Career Identity.
7. Migrar A1.
8. Migrar A2.
9. Migrar A3.
10. Migrar A4.
11. Retirar tokens legacy.
12. Ejecutar auditoría visual, responsive y accesible completa.

Cada etapa debe incluir Vercel Preview, comparación visual y contrato de regresión.

---

# 22. Definición de terminado

El rediseño se considera completo cuando:

- todas las rutas activas usan tokens canónicos;
- Montserrat está cargada de forma optimizada y consistente;
- no quedan colores primarios saturados legacy;
- A1–A4 se sienten parte del mismo producto;
- los componentes fundamentales tienen catálogo y estados;
- las rutas críticas cumplen AA;
- mobile y desktop fueron revisados;
- no existen estilos locales no documentados;
- el sistema puede ser extendido por una persona o agente sin reinterpretar la marca.

---

## Regla final

DTC debe sentirse avanzado porque comprende al usuario y organiza su progreso, no porque agrega más color, más animación o más elementos. La sofisticación nace de la claridad, la consistencia y la evidencia.
