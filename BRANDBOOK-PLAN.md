# PLAN PARA APLICAR BRANDBOOK DESDE LA RAÍZ

**Completado:**
✅ Auditoría BRANDBOOK creada (`BRANDBOOK-AUDIT.md`)
✅ Error en `landing-page-optimized.tsx` arreglado (archivo eliminado)
✅ `app/page.tsx` actualizado para usar `landing-page.tsx` funcional

---

## PRÓXIMOS PASOS (Orden Recomendado)

### FASE 1: VERIFICACIÓN Y LANDING PAGE (INMEDIATO)
1. Verificar que el sitio compila sin errores
2. Auditar `components/landing-page.tsx` contra BRANDBOOK
   - ¿Usa nombres amigables? (El Ritual, Exploración, etc)
   - ¿Usa colores correctos?
   - ¿Tono es empoderador y científico?
3. Auditar `app/layout.tsx`
   - ¿Tiene Inter font correctamente?
   - ¿Dark mode está configurado?

### FASE 2: SISTEMA DE DISEÑO (BASE)
1. Verificar `globals.css` - Variables CSS correctas
2. Verificar `tailwind.config.ts` - Colores definidos
3. Crear/actualizar componentes base (Button, Card, Typography)

### FASE 3: RUTAS DESPEGA
1. Auditar todas las páginas en `/app/despega/*`
2. Verificar nombres y colores por pilar:
   - **El Ritual (#A855F7)**: conozcamonos-1, a1-cerebral-intro, a1-cerebral
   - **Exploración (#3B82F6)**: a2/intro, a2/dashboard
   - **Entrenamiento (#F97316)**: a3/
   - **La Realidad (#06B6D4)**: a4/, conozcamonos-2
3. ⚠️ **CREAR FALTA**: `/despega/a1/resultado/page.tsx`

### FASE 4: CONTENIDO Y COPY
1. Actualizar copy en todas las páginas
   - Reemplazar "A1", "A2", "A3", "A4" por nombres amigables
   - Reemplazar "DISC" por "Perfil de Liderazgo"
   - Reemplazar "Test" por "Evaluación"
   - Cambiar tono a empoderador

### FASE 5: COMPONENTES
1. Auditar componentes compartidos
2. Actualizar iconos - deben representar pilares
3. Verificar tipografía - jerarquía clara
4. Verificar spacing - consistente

### FASE 6: QA FINAL
1. Prueba de contraste WCAG AA
2. Dark mode en todas las páginas
3. Responsive design en móvil
4. Links y CTAs funcionando

---

## CÓMO PROCEDER

**Opción A: Yo continúo (RECOMENDADO)**
- Dime si quieres que continúe con la próxima tarea
- Voy a completar cada fase sistemáticamente
- Reporto progreso en cada paso

**Opción B: Tú decides**
- ¿Qué fase quieres que empiece primero?
- ¿Hay algo específico que quieras revisar?
- ¿Necesitas ver el BRANDBOOK aplicado a una página en particular?

---

## ARCHIVOS CLAVE

```
/vercel/share/v0-project/
├── BRANDBOOK.md              ← LA FUENTE DE VERDAD
├── BRANDBOOK-AUDIT.md        ← Checklist de auditoría
├── app/
│   ├── layout.tsx            ← Font, dark mode
│   ├── page.tsx              ← Home (ACTUALIZADO ✅)
│   ├── globals.css           ← Variables CSS
│   └── despega/              ← Rutas del sistema (AUDITAR)
├── components/
│   ├── landing-page.tsx      ← Landing (FUNCIONAL ✅)
│   └── [otros]               ← Auditar todos
└── tailwind.config.ts        ← Colores del brandbook
```

---

**¿Quieres que continúe? Dime cuál es la siguiente tarea que quieres que complete.**
