# IMPLEMENTACIÓN: SISTEMA "PERFIL DESCUBIERTO"

## VISIÓN GENERAL

Sistema de reportes tipo DISC pero integrado nativamente en tu plataforma Despega, con versión FREE y PREMIUM.

---

## ARQUITECTURA IMPLEMENTADA

### 1. **BASE DE DATOS** (SQL)
```
despega_cerebral_test
├── id (UUID)
├── user_id (FK)
├── responses (JSONB) → respuestas del test híbrido
├── completed_at
└── status

despega_perfil_informe
├── id (UUID)
├── user_id (FK)
├── perfil_tipo (A/B/C/D)
├── respuestas_test (JSONB)
├── contenido_informe (JSONB)
├── es_premium (boolean)
├── scores (JSONB) → análisis, intuición, impacto
└── generado_at
```

### 2. **FLUJO DE USUARIO**

```
Usuario autenticado
  ↓
/test-cerebral → DespecaCerebralTest (híbrido 70% conversacional + 30% preguntas)
  ↓
Guardar respuestas → despega_cerebral_test
  ↓
Calcular perfil → calculateCerebralProfile()
  ↓
Generar informe → despega_perfil_informe
  ↓
Redirigir → /perfil
  ↓
PerfilDescubiertoViewer (mostrar FREE o PREMIUM)
```

### 3. **COMPONENTES CREADOS**

| Componente | Path | Descripción |
|-----------|------|-----------|
| **DespecaCerebralTest** | `/components/despega-cerebral-test.tsx` | Test híbrido interactivo (8 preguntas) |
| **PerfilDescubiertoViewer** | `/components/perfil-descubierto-viewer.tsx` | Visualizador de informe (FREE + PREMIUM) |
| **PerfilInformeViewer** | `/components/perfil-informe-viewer.tsx` | Viewer adicional (mantenido por compatibilidad) |

### 4. **PÁGINAS CREADAS**

| Página | Path | Descripción |
|--------|------|-----------|
| Test Cerebral | `/test-cerebral` | Página del test híbrido |
| Perfil Descubierto | `/perfil` | Dashboard de perfil (FREE/PREMIUM) |

### 5. **APIs CREADAS**

| Endpoint | Path | Método | Descripción |
|----------|------|--------|-----------|
| Guardar Test | `/api/despega/cerebral-test` | POST | Guarda respuestas del test |
| Generar Informe | `/api/despega/generar-informe` | POST | Genera informe basado en respuestas |

### 6. **LÓGICA DE NEGOCIO**

#### Tipos de Perfil (A/B/C/D)

```typescript
// calculateCerebralProfile(responses)
Tipo A: Dominante (⚡)
  - Análisis > Intuición
  - Directo, rápido, decisiones ágiles
  - Fortaleza: liderazgo, ejecución

Tipo B: Influyente (🌟)
  - Intuición > Análisis
  - Carismático, orientado a personas
  - Fortaleza: comunicación, inspiración

Tipo C: Cumplidor (🎯)
  - Análisis > Intuición + Precisión
  - Meticuloso, data-driven
  - Fortaleza: calidad, rigor

Tipo D: Estable (🛡️)
  - Colaborativo, orientado al equipo
  - Mediador, apoyo, consistencia
  - Fortaleza: cohesión, confianza
```

---

## VERSIONES: FREE vs PREMIUM

### FREE Version
```
✓ Test Cerebral (8 preguntas)
✓ Tipo de Perfil (A/B/C/D)
✓ 3 Quick Stats (Análisis%, Intuición%, Impacto%)
✓ Resumen básico
✓ Fortalezas (3)
✓ Áreas de desarrollo (3)
✗ Comparativa con otros usuarios
✗ Análisis detallado por competencia
✗ Rutas personalizadas (30-60-90)
✗ API access
```

### PREMIUM Version
```
✓ TODO de FREE +
✓ Análisis detallado (8 secciones)
✓ Comparativa anónima con otros usuarios
✓ Roles/Puestos ideales basados en perfil
✓ Rutas personalizadas 30-60-90
✓ Integración con CIP (capacidad efectiva)
✓ Seguimiento de progresión
✓ PDF detallado descargable
✓ API access para integrar en otros sistemas
✓ Exportar datos
```

---

## INTEGRACIONES PENDIENTES

### 1. **Botón en Dashboard**
```tsx
// En /my-learning o dashboard principal
<Button href="/test-cerebral">
  Tomar Test Despega Cerebral
</Button>
```

### 2. **Integración con CIP**
```typescript
// En PerfilDescubiertoViewer agregar:
<div>
  <h3>Tu Capacidad Efectiva (CIP)</h3>
  <CIPCapacityWidget userId={userId} />
  <p>Cómo el Test Cerebral se relaciona con tu capacidad...</p>
</div>
```

### 3. **Rutas de Aprendizaje Personalizadas**
```typescript
// Basadas en Tipo de Perfil + CIP
Tipo A → Misiones: Liderazgo, Decisión rápida, Delegación
Tipo B → Misiones: Comunicación, Influencia, Presentaciones
Tipo C → Misiones: Análisis, Calidad, Procesos
Tipo D → Misiones: Colaboración, Mediación, Cultura
```

### 4. **Premium Upsell**
```
Mostrar lock icon en:
- Comparativas
- Rutas personalizadas
- Seguimiento 30-60-90
- PDF descargable
- API access
```

---

## PRÓXIMOS PASOS (ROADMAP)

### Fase 1: Validación (Esta semana)
- [ ] Ejecutar test en /test-cerebral
- [ ] Verificar cálculo de perfil
- [ ] Probar visualización en /perfil
- [ ] Conectar con autenticación real

### Fase 2: Integración (Próxima semana)
- [ ] Agregar botón en dashboard
- [ ] Conectar con CIP
- [ ] Implementar Premium paywall
- [ ] Crear rutas personalizadas

### Fase 3: Polish (2 semanas)
- [ ] Diseño visual (tipo DISC oficial)
- [ ] Compartir informe (social)
- [ ] Descargar PDF
- [ ] Comparativas anónimas

### Fase 4: Premium Features (3 semanas)
- [ ] API documentation
- [ ] Webhooks para integraciones
- [ ] Reportes avanzados
- [ ] Analytics dashboard

---

## CÓMO TESTEAR

### 1. Test el flujo completo:
```bash
1. Ir a /test-cerebral
2. Completar 8 preguntas (mezcla de conversacional y opciones)
3. Ver redirección a /perfil
4. Verificar que muestra tipo de perfil (A/B/C/D)
```

### 2. Verificar datos en DB:
```sql
-- Ver tests completados
SELECT * FROM despega_cerebral_test WHERE user_id = 'xxx';

-- Ver informes generados
SELECT * FROM despega_perfil_informe WHERE user_id = 'xxx';
```

### 3. Probar Premium/Free:
```
- Sin suscripción → muestra FREE + CTA Premium
- Con suscripción activa → muestra PREMIUM + todas las features
```

---

## MÉTRICAS A TRACKEAR

- Test completion rate
- Average time to complete test
- Perfil type distribution (% A/B/C/D)
- Premium conversion from free informe
- API usage (si Premium tiene acceso)
- Retest frequency (usuarios que toman test > 1 vez)

---

## COMPARATIVA vs LIDERDISC.COM

| Aspecto | LIDERDISC | Despega |
|---------|-----------|---------|
| **Test** | 72 preguntas (complejo) | 8 preguntas (ágil) |
| **Data** | Cuestionario estático | Cuestionario + histórico de tareas |
| **Informe** | Genérico | Personalizado a Despega |
| **Validación** | Cuestionario solamente | Test + comportamiento real |
| **Evolución** | No (resultado fijo) | Sí (actualiza por ciclo) |
| **Integración** | Standalone | Integrado con CIP + misiones + rutas |
| **Precio** | Paid | FREE + PREMIUM |

---

Implementación completada. Listo para testing. ✅
