# AUDITORÍA BRANDBOOK - Despega Tu Carrera

**Fecha**: 2026-03-31  
**Estado**: EN PROGRESO  
**Objetivo**: Auditar todo el sitio contra el BRANDBOOK.md y generar un plan de correcciones

---

## 1. TERMINOLOGÍA Y NOMBRES AMIGABLES

### Requisito BRANDBOOK
- ✅ Usar: "El Ritual - Quién Eres Ahora", "Exploración - Aprende Nuevas Formas", "Entrenamiento - Practica Siendo", "La Realidad - Vive Tu Nueva Identidad"
- ❌ NUNCA usar: "A1", "A2", "A3", "A4", "C1", "C2", "DISC", "Test"

### Auditoría Actual
- [ ] Landing page (`landing-page.tsx`)
- [ ] Landing page optimized (`landing-page-optimized.tsx`)
- [ ] Páginas de despega (`/app/despega/*`)
- [ ] Componentes compartidos
- [ ] Meta descriptions y SEO

---

## 2. SISTEMA DE COLORES

### Requisito BRANDBOOK
```
- El Ritual: #A855F7 (Púrpura vibrante)
- Exploración: #3B82F6 (Azul primario)
- Entrenamiento: #F97316 (Naranja vibrante)
- La Realidad: #06B6D4 (Turquesa)
```

### Auditoría Actual
- [ ] Variables CSS en `globals.css`
- [ ] Tailwind config en `tailwind.config.ts`
- [ ] Uso consistente en landing page
- [ ] Uso consistente en componentes

---

## 3. TIPOGRAFÍA

### Requisito BRANDBOOK
```
- Font: Inter
- H1: text-4xl font-bold
- H2: text-2xl font-semibold
- H3: text-lg font-semibold
- Body: text-base
- Caption: text-sm / text-xs
```

### Auditoría Actual
- [ ] Layout.tsx tiene Inter importado
- [ ] Jerarquía tipográfica consistente
- [ ] Spacing y line-height correctos

---

## 4. COMPONENTES CLAVE

### Requisito BRANDBOOK
1. Progress Tracker: Mostrar 3 fases con colores de pilares
2. Milestone Cards (30/60/90)
3. Dashboard Principal
4. Navigation

### Auditoría Actual
- [ ] ¿Existen estos componentes?
- [ ] ¿Están bien implementados?
- [ ] ¿Usan colores correctos?

---

## 5. DARK MODE

### Requisito BRANDBOOK
- ✅ Automático con CSS variables
- ✅ Usar `dark:` prefix solo cuando sea necesario
- ✅ Transparencias: `bg-primary/5 dark:bg-primary/5`

### Auditoría Actual
- [ ] Dark mode testeado
- [ ] Variables CSS funcionando
- [ ] Contraste WCAG AA mínimo

---

## 6. LENGUAJE & TONE

### Requisito BRANDBOOK
- ✅ Tono: Empoderador, reflexivo, científico
- ✅ "Despega Tu Carrera" en lugar de "DTC"
- ✅ "Transformación" en lugar de "Mejora"
- ✅ "Perfil de Liderazgo" en lugar de "DISC"

### Auditoría Actual
- [ ] Revisar copy en landing page
- [ ] Revisar copy en páginas de despega
- [ ] Revisar metadata y descripciones

---

## CHECKLIST DE IMPLEMENTACIÓN

### Página Raíz
- [ ] `app/page.tsx` - Usa nombres amigables en hero
- [ ] `app/layout.tsx` - Inter font, dark mode setup
- [ ] `globals.css` - Variables CSS correctas
- [ ] `tailwind.config.ts` - Colores configurados

### Landing Page
- [ ] `components/landing-page.tsx` - Nombres y colores correctos
- [ ] `components/landing-page-optimized.tsx` - ARREGLAR (error JSX)
- [ ] Iconos: Representan pilares correctamente
- [ ] CTAs: Leads a la ruta correcta

### Rutas Despega
- [ ] `/despega/conozcamonos-1` - "Antes de empezar..."
- [ ] `/despega/a1-cerebral-intro` - Contexto sobre el test
- [ ] `/despega/a1-cerebral` - Test sin referencias a "DISC"
- [ ] `/despega/a1/resultado` - CREAR (falta)
- [ ] `/despega/a2/intro` - "Ahora que ya tenemos lectura base..."
- [ ] `/despega/conozcamonos-2` - Parte 2 de intake
- [ ] `/despega/a2/dashboard` - Misión 90 días en 3 sprints
- [ ] `/despega/a3` - "Entrenamiento aplicado"
- [ ] `/despega/a4` - "Radar Estratégico"

### Componentes Compartidos
- [ ] Buttons - Colores correctos, textos amigables
- [ ] Cards - Padding, borders, shadows consistentes
- [ ] Typography - Jerarquía clara
- [ ] Icons - Representativos, accesibles

---

## ACCIONES A TOMAR

### Priorit 1 (BLOQUEADOR)
1. [ ] Arreglar `landing-page-optimized.tsx` (error JSX línea 12)
2. [ ] Crear `/despega/a1/resultado/page.tsx`

### Prioridad 2 (CRÍTICO)
1. [ ] Auditar y actualizar variables CSS en `globals.css`
2. [ ] Auditar `tailwind.config.ts`
3. [ ] Verificar dark mode

### Prioridad 3 (IMPORTANTE)
1. [ ] Auditar landing pages - nombres y colores
2. [ ] Auditar copy - terminología correcta
3. [ ] Auditar componentes - tipografía y spacing

### Prioridad 4 (NICE TO HAVE)
1. [ ] Auditoría WCAG completa
2. [ ] Pruebas de contraste
3. [ ] Optimizaciones finales

---

## NOTAS

- El BRANDBOOK es la FUENTE DE VERDAD
- NO hacer cambios sin referencia al BRANDBOOK
- Todos los archivos deben pasar esta auditoría antes de deploy
- Revisar `Complete AI Insights System - Alignment Plan` para contexto canonical
