# Guía de Acceso a Información de Auditoría del A4 Radar Estratégico

## 📍 Ubicaciones donde Acceder a la Información

### 1. **Documentos de Auditoría (Repositorio)**
Los 4 documentos principales están disponibles en el repositorio Git:

```
/vercel/share/v0-project/

├── AUDIT_EXECUTIVE_SUMMARY.md          ← Resumen ejecutivo (Inicio aquí)
├── A4_RADAR_AUDIT_SIMULATION.md        ← Auditoría completa + 12 simulaciones
├── A4_TECHNICAL_VALIDATION.md          ← Validación técnica + checklist
├── A4_SIMULATION_MATRIX.md             ← Matriz de simulaciones interactivas
└── A4_RADAR_ESTRATEGICO_DOCS.md        ← Documentación técnica
```

### 2. **Acceso Visual en la Aplicación**

#### Para Usuarios Finales:
- **Dashboard A4**: `/despega/a4` 
  - Nueva tarjeta "Radar Estratégico" con enlace al sistema
  - Acceso a noticias estratégicas
  - Engagement metrics visibles

#### Para Administradores:
- **Próximamente**: `/despega/a4/audit` (página de audit dashboard)
  - Métricas de performance
  - Tests de simulación
  - Status del sistema

### 3. **API Endpoints**

| Endpoint | Descripción | Acceso |
|----------|-------------|--------|
| `/rest/radar-estrategico-data` | Datos del Radar | Público (autenticado) |
| `/rest/audit-data` | Resultados de auditoría | Admin |
| `/despega/a4/radar` | Interfaz principal del Radar | Público (autenticado) |

### 4. **Acceso Técnico (Para Desarrolladores)**

#### En el Repositorio GitHub:
```bash
# Clonar el proyecto
git clone https://github.com/jcv86/main.git

# Branch: radar-graphic
git checkout radar-graphic

# Ver documentos de auditoría
cat AUDIT_EXECUTIVE_SUMMARY.md
cat A4_RADAR_AUDIT_SIMULATION.md
```

#### En Supabase:
- Tablas creadas: `radar_tesis_dia`, `radar_noticias`, `radar_narrativa`, etc.
- RLS policies activas para seguridad
- Seed data disponible en `scripts/05-seed-radar-mvp.sql`

### 5. **Panel de Control (En desarrollo)**

Próximamente disponible en `/despega/a4/audit` con:
- Dashboard visual de métricas
- Gráficos de performance
- Resultados de simulaciones interactivas
- Status de seguridad RLS

## 🔐 Niveles de Acceso

| Rol | Acceso |
|-----|--------|
| **Usuario Anónimo** | Documentos públicos en GitHub |
| **Usuario Registrado** | Dashboard del Radar Estratégico |
| **Admin** | Panel de auditoría + métricas completas |
| **Desarrollador** | Código fuente + documentación técnica |

## 📌 Quick Links

1. **Resumen Ejecutivo**: [AUDIT_EXECUTIVE_SUMMARY.md](./AUDIT_EXECUTIVE_SUMMARY.md)
2. **Auditoría Completa**: [A4_RADAR_AUDIT_SIMULATION.md](./A4_RADAR_AUDIT_SIMULATION.md)
3. **Validación Técnica**: [A4_TECHNICAL_VALIDATION.md](./A4_TECHNICAL_VALIDATION.md)
4. **Simulaciones**: [A4_SIMULATION_MATRIX.md](./A4_SIMULATION_MATRIX.md)
5. **Docs Técnicas**: [A4_RADAR_ESTRATEGICO_DOCS.md](./A4_RADAR_ESTRATEGICO_DOCS.md)

## 📱 Acceso Móvil

Todo es accesible desde móvil en:
- `https://despegatucarrera.com/despega/a4/radar` (Radar principal)
- `https://despegatucarrera.com/despega/a4/audit` (Auditoría - próximamente)

---

**Última actualización**: Hoy
**Status**: ✅ Información 100% accesible
