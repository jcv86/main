# BRANDBOOK - Despega Tu Carrera

## Sistema de 4 Pilares (NOMBRES AMIGABLES - NO CÓDIGOS TÉCNICOS)

**REGLA DE ORO**: En la UI siempre mostrar nombres amigables. NUNCA "A1", "A2", "A3", "A4", "C1", "C2".

### Pilar 1: **El Ritual - Quién Eres Ahora**
- **Código Interno**: A1 (Despega Cerebral test)
- **Color**: Púrpura (#A855F7)
- **Icono**: Ritual/Círculo meditativo
- **Descripción**: Descubre tu verdadero perfil sin filtros, con diagnósticos profundos basados en liderdisc.com
- **Componentes**:
  - Evaluación Integral: Personalidad, valores, emociones
  - Tests Científicos: 6 evaluaciones validadas
  - Punto de Partida: De dónde realmente estás
  - Análisis Personal: 15-20 minutos por test
- **Outcome**: Perfil Despega Cerebral (D/I/S/C - pero siempre llamarlo "perfil de liderazgo")

### Pilar 2: **Exploración - Aprende Nuevas Formas**
- **Código Interno**: A2 (Ruta personalizada)
- **Color**: Azul (#3B82F6)
- **Icono**: Bombilla/Exploración
- **Descripción**: Descubre tu ruta de 30/60/90 días con 120+ recursos, libros y estrategias reales
- **Componentes**:
  - 120+ Libros Profesionales: Narrativas de transformación
  - Búsqueda Semántica: Respuestas de la transición
  - 100+ Recursos Web: Estrategias y ejemplos reales
  - Exploración Continua: Nuevos contenidos cada mes
- **Outcome**: Plan personalizado 30/60/90 días

### Pilar 3: **Entrenamiento - Practica Siendo**
- **Código Interno**: A3 (Entrenamientos e Simulaciones)
- **Color**: Naranja (#F97316)
- **Icono**: Flecha/Entrenamiento
- **Descripción**: Simulaciones de entrevistas, escenarios reales y feedback para practicar tu nueva identidad
- **Componentes**:
  - Simulaciones de Entrevistas: Escenarios realistas con múltiples opciones
  - Feedback Conductual: Análisis de tus respuestas en tiempo real
  - Progresión Inteligente: Dificultad adaptada a tu nivel
  - Coach IA: Acompañamiento personalizado en entrenamientos
- **Outcome**: Confianza y preparación para enfrentar la nueva realidad

### Pilar 4: **La Realidad - Vive Tu Nueva Identidad**
- **Código Interno**: A4 (Contexto estratégico + Market intel)
- **Color**: Turquesa (#06B6D4)
- **Icono**: Globo/Mercado
- **Descripción**: Noticias del mercado, coaching IA 24/7 y plan de acción para materializar tu transición
- **Componentes**:
  - Noticias del Mercado: Contexto y oportunidades en tiempo real
  - Coach IA Personalizado: Sofía & Dani acompañan 24/7
  - Plan de Acción - 30, 60 o 90 Días: Elige tu ritmo
  - Contexto Chileno: Adaptado al mercado y oportunidades locales
- **Outcome**: Transición accionable con inteligencia de mercado

---

## Paleta de Colores

### Pilares (Por fase)
- **El Ritual** (#A855F7): Púrpura vibrante - Descubrimiento
- **Exploración** (#3B82F6): Azul primario - Aprendizaje
- **Entrenamiento** (#F97316): Naranja vibrante - Práctica
- **La Realidad** (#06B6D4): Turquesa - Acción

### Sistema de Diseño (Semantic Tokens)
- **Primario**: `text-foreground` (texto principal)
- **Secundario**: `text-muted-foreground` (texto secundario)
- **Fondo**: `bg-background` (fondo general)
- **Cards**: `bg-card` (fondo de cards)
- **Bordes**: `border-border` (bordes)
- **Acento**: `text-accent` / `bg-accent/10` (elementos destacados)
- **Éxito**: Verde (#22c55e)
- **Advertencia**: Naranja (#f97316)
- **Error**: Rojo (#ef4444)

### Dark Mode
- Automático con CSS variables en `globals.css`
- Usar `dark:` prefix en Tailwind solo cuando se necesite override
- Transparencias para oscuro: `bg-primary/5 dark:bg-primary/5`

---

## Tipografía

- **Font Family**: Inter (definido en layout.tsx)
- **Jerarquía**:
  - H1: `text-4xl font-bold` - Títulos de página
  - H2: `text-2xl font-semibold` - Títulos de sección
  - H3: `text-lg font-semibold` - Subtítulos
  - Body: `text-base` - Texto normal
  - Caption: `text-sm` o `text-xs` - Metadata

---

## Lenguaje & Terminología

### ✅ SIEMPRE Usar
- "Despega Tu Carrera"
- "El Ritual - Quién Eres Ahora"
- "Exploración & Ensayo"
- "La Realidad - Dónde Vive"
- "Despega Cerebral" (para el test A1)
- "Perfil de Liderazgo" (en lugar de DISC profile)
- "Transformación" (no "mejora" o "cambio")

### ❌ NUNCA Usar
- "A1", "A2", "A3", "A4", "C1", "C2" (en UI)
- "DISC" (siempre "Despega Cerebral")
- "Test" (usar "Evaluación", "Descubrimiento")
- "Mejorar" (usar "Expandir", "Desarrollar")
- Códigos técnicos

---

## Componentes Clave

### Progress Tracker
- Mostrar 3 fases: "El Ritual" → "Exploración" → "La Realidad"
- Color de pilar (púrpura/azul/turquesa)
- Estados: Completado (accent), En Curso (primary), Pendiente (muted)
- Incluir descripción inspiradora

### Milestone Cards (30/60/90)
- Título: "Día 30", "Día 60", "Día 90"
- Objetivo principal
- 3 tareas clave (con checkmarks)
- Indicador de intensidad (suave/moderada/alta)
- Colores según intensidad

### Dashboard Principal
- Header: "Tu Transformación" + Progreso
- 3 secciones por pilar (El Ritual / Exploración / La Realidad)
- Cada sección: Progreso, Próximos pasos, Coach IA
- CTAs claramente visibles

### Navigation
- Links a los 3 pilares (NO códigos técnicos)
- Indicador de posición actual
- Accesible en mobile y desktop

---

## Guías de Implementación

### Para Todas las Páginas/Componentes
1. ✅ Usar nombres amigables (El Ritual, Exploración, etc)
2. ✅ Colores del brandbook (púrpura/azul/turquesa por fase)
3. ✅ CSS variables (NO hardcoded colors)
4. ✅ Dark mode soportado
5. ✅ Tipografía: Inter con jerarquía clara
6. ✅ Spacing: Usar gap classes (no márgenes arbitrarios)
7. ✅ Responsive: Mobile-first
8. ✅ Contraste WCAG AA mínimo
9. ✅ Sin DISC terminology
10. ✅ Tono: Empoderador, reflexivo, científico

### Ejemplo Correcto
```tsx
// El Ritual - Quién Eres Ahora
<div className="bg-purple-50/50 dark:bg-purple-950/10 border border-purple-200/30">
  <h2 className="text-foreground text-2xl font-semibold">
    El Ritual - Quién Eres Ahora
  </h2>
  <p className="text-muted-foreground">
    Descubre tu verdadero perfil sin filtros
  </p>
</div>
```

### Ejemplo Incorrecto ❌
```tsx
// DON'T DO THIS
<div className="bg-purple-100">
  <h2 className="text-purple-900">A1: Despega Cerebral Test</h2>
  <p className="text-purple-700">DISC assessment</p>
</div>
```

---

## Checklist de Auditoría Completa

- [ ] Home page: Usa nombres amigables en cards
- [ ] Onboarding: C1 → A1 → C2 → Ruta (nombres amigables)
- [ ] Dashboard: 3 pilares con colores correctos
- [ ] Componentes CANON: Sin referencias a "A1/A2/A3/A4"
- [ ] Dark mode: Testeado en todas las páginas
- [ ] Colores: Solo usando tokens de brandbook
- [ ] Tipografía: Inter con jerarquía clara
- [ ] Spacing: Consistente, sin valores arbitrarios
- [ ] Sin DISC: Cambiar a "Despega Cerebral"
- [ ] Contraste: WCAG AA mínimo
- [ ] Tono: Inspirador, no juzgador
- [ ] Responsive: Funciona en móvil

---

## Referencias de Archivos
- Colores: `app/globals.css` (variables CSS)
- Tailwind: `tailwind.config.ts`
- Tipografía: `app/layout.tsx` (Inter font)
- Componentes: `components/`
- Páginas: `app/` y `app/despega/`

