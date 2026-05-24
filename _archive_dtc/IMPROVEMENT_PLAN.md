# 🎯 PLAN DE MEJORA PRIORITIZADO
## Despega Tu Carrera - Implementación Brandbook

---

## QUICK WIN - Cambios Inmediatos (Esta Semana)

### 1. Actualizar Headers de Páginas Principales ⚡
```tsx
// ANTES ❌
<h1>A1: Despega Cerebral</h1>

// DESPUÉS ✅
<h1>El Ritual - Quién Eres Ahora</h1>
```

**Archivos**: 
- app/despega/a1-cerebral/page.tsx
- app/despega/a2-routes/page.tsx  
- app/despega/a3-dashboard/page.tsx
- app/despega/a4-base/page.tsx

**Tiempo**: 30 minutos | **Impact**: Alto

---

### 2. Fix Resultados DISC ⚡
```tsx
// ANTES ❌
"Your DISC profile is: D/I/S/C"

// DESPUÉS ✅
"Tu Perfil de Liderazgo es: Impulsor/Catalizador/Estabilizador/Arquitecto"
```

**Archivo**: components/disc-results-page.tsx

**Tiempo**: 45 minutos | **Impact**: Alto

---

### 3. Gradiente Púrpura Consistente ⚡
```tsx
// Escala de colores A1 (El Ritual)
const a1Colors = {
  light: 'bg-purple-50 dark:bg-purple-950/10',
  border: 'border-purple-200/30 dark:border-purple-800/30',
  primary: 'bg-purple-600 dark:bg-purple-500', // #A855F7 equivalent
  accent: 'from-purple-600 to-purple-500',
}
```

**Tiempo**: 1 hora | **Impact**: Medio

---

## SPRINT 1 TASKS (Semanas 1-2)

### Week 1: Terminología

- [ ] **Tarea 1.1**: Reemplazar "A1/A2/A3/A4" en 50+ archivos
  - **Script**: `grep -r "A1:" app/ components/ | wc -l`
  - **Replace**: sed -i 's/A1:/El Ritual:/g'
  - **Files**: 15-20 archivos
  - **Time**: 2 horas

- [ ] **Tarea 1.2**: Cambiar "DISC profile" → "Perfil de Liderazgo"
  - **Files**: 12 componentes
  - **Time**: 1.5 horas

- [ ] **Tarea 1.3**: Cambiar "Test" → "Evaluación"
  - **Files**: 30+ referencias
  - **Time**: 2 horas

- [ ] **Tarea 1.4**: Audit nombres en navegación
  - **Files**: Navbar, sidebar, menus
  - **Time**: 1 hora

**Week 1 Total**: 6.5 horas | **QA**: 1 hora

---

### Week 2: Colores Críticos

- [ ] **Tarea 2.1**: Fix gradientes A1 (Púrpura)
  - **Files**: 8 componentes A1
  - **Change**: bg-purple-* → Usar escala consistente
  - **Time**: 2 horas

- [ ] **Tarea 2.2**: Fix colores A2 (Azul)
  - **Files**: 12 componentes A2
  - **Change**: bg-blue-* → #3B82F6 consistente
  - **Time**: 2 horas

- [ ] **Tarea 2.3**: Fix colores A3 (Naranja)
  - **Files**: 10 componentes A3
  - **Change**: bg-orange-* → #F97316 consistente
  - **Time**: 1.5 horas

- [ ] **Tarea 2.4**: Fix colores A4 (Turquesa)
  - **Files**: 8 componentes A4
  - **Change**: bg-cyan/teal → #06B6D4 consistente
  - **Time**: 1.5 horas

- [ ] **Tarea 2.5**: Dark mode testing
  - **Browsers**: Chrome, Firefox, Safari
  - **Time**: 1 hora

**Week 2 Total**: 8 horas | **QA**: 1.5 horas

---

## SPRINT 2 TASKS (Semanas 3-4)

### Week 3: Espaciado

- [ ] **Tarea 3.1**: Audit spacing en 30 componentes
  - **Output**: Documento de "violations" 
  - **Time**: 2 horas

- [ ] **Tarea 3.2**: Crear guía de spacing document
  - **Content**: Escala permitida, ejemplos
  - **Time**: 1 hora

- [ ] **Tarea 3.3**: Refactor gap classes
  - **Replace**: Random gaps → gap-2/4/6/8
  - **Files**: 25 componentes
  - **Time**: 4 horas

- [ ] **Tarea 3.4**: Fix margin/padding arbitrarios
  - **Replace**: px-3.5, mt-7 → px-4, mt-8
  - **Files**: 40 componentes
  - **Time**: 3 horas

**Week 3 Total**: 10 horas | **QA**: 1.5 horas

---

### Week 4: Tipografía + Responsive

- [ ] **Tarea 4.1**: Standardize heading sizes
  - **H1**: text-4xl font-bold
  - **H2**: text-2xl font-semibold
  - **H3**: text-lg font-semibold
  - **Files**: 30 componentes
  - **Time**: 2 horas

- [ ] **Tarea 4.2**: Fix line-height inconsistencia
  - **Standard**: 1.6 para body, 1.4 para headings
  - **Time**: 1 hora

- [ ] **Tarea 4.3**: Test responsive
  - **Breakpoints**: Mobile (320px), Tablet (768px), Desktop (1024px)
  - **Tools**: Chrome DevTools, responsively.app
  - **Time**: 2 horas

- [ ] **Tarea 4.4**: Performance audit
  - **Tool**: Lighthouse
  - **Target**: 85+ score
  - **Time**: 1.5 horas

**Week 4 Total**: 6.5 horas | **QA**: 1 hora

---

## SPRINT 3 TASKS (Semanas 5-6)

### Week 5: Accesibilidad (Colores + Alt Text)

- [ ] **Tarea 5.1**: Audit contraste
  - **Tool**: WebAIM contrast checker
  - **Target**: 4.5:1 ratio (100%)
  - **Files**: 100+ elementos
  - **Time**: 3 horas

- [ ] **Tarea 5.2**: Fix contraste bajo
  - **Changes**: Ajustar colores/weights
  - **Files**: 22 elementos identificados
  - **Time**: 2 horas

- [ ] **Tarea 5.3**: Agregar alt text
  - **Target**: 180+ imágenes
  - **Standard**: Descriptivo, < 125 caracteres
  - **Time**: 4 horas

**Week 5 Total**: 9 horas | **QA**: 1.5 horas

---

### Week 6: Focus + Finalización

- [ ] **Tarea 6.1**: Agregar focus visible states
  - **Selector**: :focus-visible
  - **Color**: ring ring-offset-2
  - **Files**: 8 botones + inputs
  - **Time**: 1 hora

- [ ] **Tarea 6.2**: ARIA labels en componentes complejos
  - **Files**: 15+ componentes
  - **Time**: 2 horas

- [ ] **Tarea 6.3**: A1-A4 component finalization
  - **Verify**: Colores, tipografía, spacing
  - **Time**: 1.5 horas

- [ ] **Tarea 6.4**: Final QA pass
  - **Checklist**: Complete WCAG audit
  - **Time**: 2 horas

- [ ] **Tarea 6.5**: Crear documentación
  - **Files**: CODE_REVIEW_CHECKLIST.md
  - **Time**: 1 hora

**Week 6 Total**: 7.5 horas | **QA**: 2 horas

---

## RECURSOS & CALENDARIO

### Por Sprint
```
SPRINT 1 (Weeks 1-2): 
  - Team: 1 Lead + 1 Dev
  - Horas: 40 (dev) + 8 (QA)
  - Deliverables: Terminología 100% + Colores críticos

SPRINT 2 (Weeks 3-4):
  - Team: 2 Devs + 1 QA
  - Horas: 48 (dev) + 10 (QA)
  - Deliverables: Spacing + Tipografía standardized

SPRINT 3 (Weeks 5-6):
  - Team: 1 Lead + 1 Dev + 1 Accessibility specialist
  - Horas: 56 (dev) + 12 (QA)
  - Deliverables: WCAG 2.1 AA compliance
```

### Total
- **Development**: 144 horas
- **QA**: 30 horas
- **Management**: 15 horas (standups, reviews)
- **Total**: ~189 horas (4.7 FTE para 6 semanas)

---

## CHECKLIST DE VALIDACIÓN

### Por Sprint

#### Sprint 1 Checklist ✅
- [ ] Todos los "A1/A2/A3/A4" reemplazados
- [ ] DISC terminology 100% changed
- [ ] 4 pilares con colores correctos
- [ ] Dark mode funciona
- [ ] No hay regressions visuales

#### Sprint 2 Checklist ✅
- [ ] Spacing scale: solo 2,4,8,12,16,24,32,48,64px
- [ ] Gap classes estandarizados
- [ ] Tipografía: H1-H4 y body consistentes
- [ ] Responsive: mobile/tablet/desktop OK
- [ ] Lighthouse: 85+ score

#### Sprint 3 Checklist ✅
- [ ] Contraste: 100% elementos 4.5:1 ratio
- [ ] Alt text: 100% imágenes
- [ ] Focus visible: todos los botones/inputs
- [ ] ARIA labels: componentes complejos
- [ ] WCAG 2.1 AA: pass

---

## DOCUMENTOS A CREAR

1. **CODE_REVIEW_CHECKLIST.md** - Para future PRs
   ```
   - [ ] Usar terminología correcta (El Ritual, no A1)
   - [ ] Colores: solo usar Tailwind tokens, no hardcoded
   - [ ] Spacing: múltiples de 4px
   - [ ] Tipografía: H1/H2/H3/Body estandarizada
   - [ ] Dark mode: testear
   - [ ] Accesibilidad: contraste 4.5:1
   - [ ] Alt text: todas las imágenes
   - [ ] Focus visible: botones/inputs
   ```

2. **COLOR_MIGRATION_GUIDE.md** - Referencia para devs
   ```
   A1 (El Ritual): #A855F7 / purple-600
   A2 (Exploración): #3B82F6 / blue-500
   A3 (Entrenamiento): #F97316 / orange-500
   A4 (La Realidad): #06B6D4 / cyan-500
   ```

3. **SPACING_STANDARDS.md** - Escala completa
   ```
   2px - Separación mínima
   4px - Base unit
   8px - Pequeño
   ...
   64px - Grande
   ```

---

## RIESGOS & MITIGACIÓN

| Riesgo | Mitigación |
|--------|-----------|
| Regressions visuales | Feature branches + QA exhaustivo |
| Performance hit | Lighthouse testing en cada PR |
| Dark mode breaks | Test en todos los browsers |
| Scope creep | Priorizar Tier 1 primero |
| Team capacity | Adjust timeline si es necesario |

---

## SUCCESS METRICS

```
Inicio:        Fin (Semana 6):
Cumplimiento: 42% → 95%+
Terminología: 28% → 100%
Colores:      31% → 95%+
Contraste:    58% → 100%
Lighthouse:   78  → 90+
```

---

**Owner**: Product Lead | **Start**: Week 1 | **End**: Week 6 | **Updated**: March 30, 2026
