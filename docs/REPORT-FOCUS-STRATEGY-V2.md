# Estrategia de Informe Completo + Foco por Nivel Usuario (V2)

## 0. Idea Central

Queremos que el usuario DTC tenga desde el primer momento la sensación de:
**"Wow, este informe es profundo y está lleno de valor para mí."**

Por eso, el informe completo **siempre existe y siempre es accesible**, pero:
- Lo que cambia con el nivel de usuario **no es el acceso, sino el FOCO**.
- El sistema decide qué partes del informe están activamente en juego para la misión actual, y cuáles quedan marcadas como "para más adelante" o "solo lectura".

Así evitamos que el usuario se llene de tareas imposibles, sin perder el efecto de "producto potente" al ver un informe largo y completo.

---

## 1. Principios Clave

### 1. Informe completo desde el día 1
- Cada test (Cerebral, IE, Mapa, 5D, Brújula, Competencias) genera su informe full V2 con todas las secciones.
- El usuario siempre tiene un botón visible tipo: **"Ver informe completo (modo profundo)"**.

### 2. Lo que se regula es el FOCO, no el texto
Según el nivel y la misión, DTC marca qué secciones están:
- 🟢 **FOCO AHORA** (Misión actual)
- 🟡 **Próxima misión / futuro cercano**
- ⚪ **Lectura opcional / inspiración**

### 3. Solo las zonas FOCO AHORA pueden convertirse en tareas activas
El resto puede leerse, pero no empuja a llenar la misión con 20 objetivos.

### 4. Recuerda siempre la misión de 3 meses
Todo se ordena desde la lógica **Misión 90 días + Tramos (0–30 / 31–60 / 61–90) + Intensidad**.

---

## 2. Cómo se ve el informe según nivel (UX)

### 2.1 Estructura visual base

Para cualquier nivel, el informe se presenta así:

1. **Header** con datos de usuario + test + nivel actual DTC
2. **One-Pager / Resumen** (siempre visible completo)
3. **Cuerpo del informe** dividido en secciones (perfil, fortalezas, riesgos, plan 90 días, etc.)
4. **Barra lateral o etiquetas** visibles con los estados:
   - 🟢 FOCO AHORA
   - 🟡 Próxima misión
   - ⚪ Opcional
5. **Botón fijo**: "Ver informe completo (modo profundo)" que abre el documento sin colapsar nada

### 2.2 Nivel 0–1 (Explorador / Primeros Pasos)

**Lo primero que ve:**
- One-Pager muy claro
- 2–3 secciones clave marcadas 🟢 FOCO AHORA:
  - Perfil general simple
  - 2–3 fortalezas
  - 2–3 riesgos/prioridades
  - Plan 90 días reducido con muy pocos objetivos/hábitos

**El resto del informe:**
- Colapsado o más abajo, con etiquetas 🟡 o ⚪
- Ejemplo: "Otras zonas de tu informe que veremos más adelante"

**Botón "Ver informe completo"** siempre disponible, pero el default es vista enfocada.

### 2.3 Nivel 2 (Usuario Comprometido)

**Ve One-Pager + más secciones en 🟢:**
- Perfil en profundidad
- Fortalezas + riesgos más detallados
- Plan 90 días con más matices

**Algunas partes siguen en 🟡 (próximas misiones) / ⚪ (lectura opcional):**
- Conexiones con otros tests
- Bloque avanzado para coach
- Ideas de misiones futuras

### 2.4 Nivel 3–4 (Usuario Profundo / Power User)

- Prácticamente todo el informe puede estar disponible en modo normal
- Sigue existiendo la lógica de etiquetas, pero:
  - Hay más secciones en 🟢 y 🟡
  - El usuario sabe manejar mejor la profundidad
- Informe completo se abre casi de inmediato (menos colapsado, más directo)

---

## 3. Reglas para FOCO AHORA / Próxima misión / Opcional

### 3.1 FOCO AHORA (🟢)

**Secciones cuya información se traduce en objetivos/hábitos de la Misión activa.**

**Ejemplos:**
- En Cerebral: estilo de pensamiento y 2–3 riesgos críticos que afectan la vida diaria
- En IE: formas de regular emociones que se van a trabajar este trimestre
- En Brújula: 2 familias vocacionales que va a explorar en estos 90 días

**Solo aquí aparecen botones del tipo:**
- "Añadir este foco a mi misión actual"
- "Crear hábito ligado a este insight"

### 3.2 Próxima misión / Futuro cercano (🟡)

- Zonas importantes, pero no para este trimestre
- Se muestran como: "Temas que probablemente trabajemos en tu próxima misión"
- No crean tareas ahora, pero el sistema puede usarlas para proponer la Misión Nº2

### 3.3 Lectura opcional / inspiración (⚪)

- Contenido de alto valor pero no crítico para acción inmediata
- Ejemplos: explicación teórica más profunda, matices de personalidad menos urgentes
- Sirve para usuarios curiosos y para el coach

---

## 4. Comportamiento del botón "Ver informe completo"

- **Siempre visible, todas las veces, para todos los niveles**
- Al pulsarlo, el usuario ve:
  - El informe completo, sin colapsar secciones
  - Aún con etiquetas 🟢🟡⚪, pero nada escondido

**Es perfecto para:**
- Usuarios que aman leer todo
- Coaches humanos
- Sesiones más profundas

**Mensaje ejemplo:**
> "Esta es la versión completa de tu informe. No necesitas leerla toda de una vez; DTC ya marcó en verde lo que es foco para tu misión actual."

---

## 5. Relación con niveles de usuario y carga de misiones

### Nivel 0–1:
- FOCO AHORA ocupa solo una parte pequeña del informe
- Máx. 2 objetivos y 4–5 hábitos activos
- Intensidad de misión: **Ligera**

### Nivel 2:
- FOCO AHORA abarca más secciones
- Hasta 3 objetivos y 9 hábitos, pero repartidos por tramos
- Intensidad: **Estándar**

### Nivel 3–4:
- FOCO AHORA + Próxima misión cubren casi todo el informe
- Se usan más conexiones entre tests
- Intensidad: **Estándar/Intensa** con mucho cuidado

**Regla ancla:**
> El informe completo puede ser gigante, pero la Misión activa siempre cabe en la vida real de la persona.

---

## 6. Implicancias para implementación

### 6.1 Modelo de datos

Además de lo ya definido en el blueprint:

**Por sección de informe (o bloque):**
- `id_seccion`
- `tipo_seccion` (perfil, fortalezas, riesgos, plan_90, etc.)
- `estado_foco` ∈ {"ahora", "proxima_mision", "opcional"}

**Por usuario/test:**
- `nivel_info_visible` (snapshot / parcial / completo)
- `nivel_usuario_dtc` (0–4)

### 6.2 UI

- **Vista estándar**: muestra One-Pager + secciones 🟢 y parte de 🟡
- **Vista "Informe completo"**: muestra todas las secciones, respetando etiquetas

### 6.3 Motor de misión

Al construir la Misión:
- Solo puede crear objetivos/hábitos desde bloques 🟢 del informe
- Puede usar bloques 🟡 como sugerencia para la siguiente misión
- Nunca crea tareas desde bloques ⚪ (a menos que usuario/coach lo pida explícitamente)

---

## 7. Frase de producto para recordar esta lógica

> "En DTC siempre puedes ver tu informe completo desde el primer día. Lo que cambia con tu nivel no es cuánto te escondemos, sino qué parte se convierte en foco real de tu misión y qué queda como inspiración para más adelante."
