# 📋 CÓDIGO DE REVIEW CHECKLIST
## Brandbook Compliance - Despega Tu Carrera

Usa esta checklist para TODO PR que toque UI/UX

---

## ✅ ANTES DE MERGING

### 🔤 Terminología
- [ ] ¿Usa "El Ritual" en lugar de "A1"?
- [ ] ¿Usa "Exploración" en lugar de "A2"?
- [ ] ¿Usa "Entrenamiento" en lugar de "A3"?
- [ ] ¿Usa "La Realidad" en lugar de "A4"?
- [ ] ¿Dice "Perfil de Liderazgo" en lugar de "DISC profile"?
- [ ] ¿Dice "Evaluación" en lugar de "Test"?
- [ ] ¿Personalidades son: Impulsor, Catalizador, Estabilizador, Arquitecto?

**Fail**: Si hay ANY "A1", "A2", "A3", "A4", "DISC" en UI → Request changes

---

### 🎨 Colores
- [ ] ¿NO hay hardcoded colors (bg-red-600, text-blue-500)?
- [ ] ¿Usa Tailwind tokens o CSS variables?
- [ ] ¿A1 componentes usan purple (#A855F7)?
- [ ] ¿A2 componentes usan blue (#3B82F6)?
- [ ] ¿A3 componentes usan orange (#F97316)?
- [ ] ¿A4 componentes usan cyan (#06B6D4)?
- [ ] ¿Dark mode funciona (test con `prefers-color-scheme`)?

**Reference**:
```tsx
// ✅ BUENO
className="bg-purple-600 dark:bg-purple-500 text-white"

// ❌ MALO
className="bg-indigo-700 text-blue-900"
```

**Fail**: Si hay hardcoded colors → Request changes

---

### 📐 Espaciado
- [ ] ¿Padding/margin son múltiples de 4px (4,8,12,16,24,32,48,64)?
- [ ] ¿NO hay valores arbitrarios (px-3.5, mt-7, pb-13)?
- [ ] ¿Gap classes están estandarizados (gap-2, gap-4, gap-6)?
- [ ] ¿Responsive design presente (md:, lg: prefixes)?
- [ ] ¿Mobile first approach usado?

**Reference**:
```tsx
// ✅ BUENO
className="p-6 gap-4 md:p-8 lg:gap-6"

// ❌ MALO
className="p-7 gap-3 md:p-9 lg:gap-5"
```

**Fail**: Si hay valores fuera de escala → Request changes

---

### 🔤 Tipografía
- [ ] ¿Headings usan escala estandarizada (text-4xl, text-2xl, text-lg)?
- [ ] ¿NO hay tamaños arbitrarios (text-3.5xl, text-5.5xl)?
- [ ] ¿Line-height es 1.4 (headings) o 1.6 (body)?
- [ ] ¿Font-weight es 400, 500, 600, o 700 (no 450, 550)?

**Reference**:
```tsx
// ✅ BUENO
<h1 className="text-4xl font-bold leading-tight">Título</h1>
<p className="text-base leading-relaxed">Body text</p>

// ❌ MALO
<h1 className="text-5.5xl font-medium" style={{lineHeight: "1.5"}}>Título</h1>
```

**Fail**: Si hay tamaños fuera de escala → Request changes

---

### ♿ Accesibilidad
- [ ] ¿Contraste es 4.5:1 mínimo (texto normal)?
- [ ] ¿Todos los botones tienen `:focus-visible` clear?
- [ ] ¿Imágenes tienen alt text descriptivo?
- [ ] ¿Elementos interactivos son keyboard-navigable?
- [ ] ¿ARIA labels en componentes complejos?

**Test**:
```bash
# Color contrast
# https://webaim.org/resources/contrastchecker

# Keyboard nav
Tab + Shift+Tab through entire component

# Alt text
<img alt="Descripción clara de la imagen" src="..." />
```

**Fail**: Si contraste < 4.5:1 o no es keyboard accessible → Request changes

---

### 🎯 Componentes A1-A4
- [ ] ¿Component marca claramente su pilar (A1/A2/A3/A4)?
- [ ] ¿Colores del pilar aplicados correctamente?
- [ ] ¿Icono del pilar presente si es relevante?
- [ ] ¿Descripción amigable visible (no código técnico)?

**Reference**:
```tsx
// ✅ BUENO - A1 (El Ritual)
<div className="bg-purple-50 dark:bg-purple-950/10 border border-purple-200/30">
  <h2>El Ritual - Quién Eres Ahora</h2>
  <p>Descubre tu verdadero perfil sin filtros</p>
</div>

// ❌ MALO
<div className="bg-indigo-100">
  <h2>A1: Despega Cerebral Test</h2>
  <p>DISC assessment module</p>
</div>
```

**Fail**: Si usa código técnico o colores incorrectos → Request changes

---

### 🌙 Dark Mode
- [ ] ¿Componente testea en light AND dark?
- [ ] ¿Colors correctos en ambos modos?
- [ ] ¿Text readable en ambos fondos?
- [ ] ¿NO usa hardcoded contrasts que rompen dark?

**Test**:
```bash
# Chrome DevTools → Rendering → Emulate CSS media feature prefers-color-scheme
# Test: light, dark, y auto
```

**Fail**: Si dark mode se ve roto → Request changes

---

### 📱 Responsive
- [ ] ¿Testeado en mobile (320px)?
- [ ] ¿Testeado en tablet (768px)?
- [ ] ¿Testeado en desktop (1024px+)?
- [ ] ¿NO hay horizontal scroll?
- [ ] ¿Text readable en all sizes?

**Test**:
```bash
Chrome DevTools → Device Toolbar
Test: iPhone SE, iPad, Desktop
```

**Fail**: Si no es responsive → Request changes

---

## 🚀 CUANDO APPROVE

Si checklist está 100% ✅:
- Approve PR
- Deploy a staging
- QA team testing
- Schedule release

---

## ❌ COMÚN ISSUES & FIXES

### Issue: "Tiene hardcoded color"
```tsx
// ❌ ANTES
<div className="bg-red-500 text-white">Error</div>

// ✅ DESPUÉS
<div className="bg-destructive text-destructive-foreground">Error</div>
```

### Issue: "Spacing fuera de escala"
```tsx
// ❌ ANTES
<div className="p-7 gap-3 mb-11">Content</div>

// ✅ DESPUÉS
<div className="p-8 gap-4 mb-12">Content</div>
```

### Issue: "Falta alt text"
```tsx
// ❌ ANTES
<img src="user-profile.jpg" />

// ✅ DESPUÉS
<img alt="Perfil de usuario - María González" src="user-profile.jpg" />
```

### Issue: "Contrast bajo"
```tsx
// ❌ ANTES (1.8:1 ratio ❌)
<p className="text-gray-500 bg-white">Light text</p>

// ✅ DESPUÉS (4.5:1 ratio ✅)
<p className="text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-900">Light text</p>
```

### Issue: "Focus visible falta"
```tsx
// ❌ ANTES
<button className="bg-blue-600 text-white">Click</button>

// ✅ DESPUÉS
<button className="bg-blue-600 text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-800">
  Click
</button>
```

---

## 📊 MÉTRICAS POR PR

**Ideal PR**:
- Lines changed: < 300
- Files changed: < 5
- Time to review: < 15 min
- Checkboxes passed: 100%
- Regressions: 0

**Red Flags**:
- > 500 líneas sin justificación
- Hardcoded colors reintroducidas
- Spacing inconsistente
- Dark mode broken
- Accessibility ignored

---

## 🎓 REFERENCIAS RÁPIDAS

**Brandbook**: `/BRANDBOOK.md`
**Audit Report**: `/AUDIT_BRANDBOOK.md`
**Improvement Plan**: `/IMPROVEMENT_PLAN.md`
**Color Palette**: 
- A1: #A855F7 (Púrpura)
- A2: #3B82F6 (Azul)
- A3: #F97316 (Naranja)
- A4: #06B6D4 (Turquesa)

**Spacing Scale**: 2, 4, 8, 12, 16, 24, 32, 48, 64px

**Typography**:
- H1: text-4xl bold
- H2: text-2xl semibold
- H3: text-lg semibold
- Body: text-base regular

---

**Version**: 1.0 | **Last Updated**: March 30, 2026
