# 📋 PREGUNTAS OPERACIONALES - DTC PLATFORM

**Fecha:** Enero 2025  
**Para:** Juan  
**De:** Equipo de Desarrollo  
**Estado:** Pendiente de Respuesta

---

## 🎯 RESUMEN EJECUTIVO

Este documento contiene preguntas críticas sobre aspectos operacionales, de seguridad, compliance y arquitectura de la plataforma DespegarTuCarrera que requieren clarificación antes del siguiente sprint.

---

## 1️⃣ AUTOPUBLICACIÓN (#4)

### Pregunta
**¿La funcionalidad de autopublicación está activa o es parte del siguiente sprint?**

**Contexto:**
- Necesitamos confirmar si el sistema de autopublicación de contenido está operativo
- Esto afecta el workflow de revisión y aprobación de contenido

**Impacto:**
- 🔴 Alto - Afecta el flujo de trabajo del equipo de contenido
- Requiere configuración de permisos y validaciones

**Respuesta:**
\`\`\`
[Pendiente]
\`\`\`

**Acciones Requeridas:**
- [ ] Confirmar estado actual
- [ ] Si está activo: documentar proceso
- [ ] Si no está activo: priorizar en backlog

---

## 2️⃣ HISTORIAL Y VERSIONADO

### Pregunta
**¿Dónde se guarda el historial/diff de versiones? ¿Cuál es la política de retención?**

**Contexto:**
- Necesitamos rastrear cambios en:
  - Resultados de tests
  - Perfiles de usuario
  - Contenido de biblioteca
  - Configuraciones del sistema
  - Prompts de IA

**Impacto:**
- 🟡 Medio - Importante para auditoría y debugging
- Afecta almacenamiento y costos

**Información Requerida:**
- Ubicación de almacenamiento (tabla/servicio)
- Período de retención (días/meses)
- Estrategia de archivado
- Proceso de purga automática

**Respuesta:**
\`\`\`
[Pendiente]
\`\`\`

**Acciones Requeridas:**
- [ ] Documentar ubicación de versionado
- [ ] Definir política de retención
- [ ] Implementar proceso de archivado
- [ ] Configurar alertas de almacenamiento

---

## 3️⃣ UMBRALES DE SEVERIDAD AUTOMÁTICA

### Pregunta
**¿Cuáles son los umbrales de severidad automática para alertas y notificaciones?**

**Contexto:**
- Sistema de alertas para:
  - Errores de API
  - Fallos de tests
  - Problemas de rendimiento
  - Errores de IA
  - Problemas de base de datos

**Impacto:**
- 🔴 Alto - Crítico para monitoreo y respuesta a incidentes

**Información Requerida:**
- Umbrales por tipo de error:
  - 🟢 **Low:** ¿Qué condiciones?
  - 🟡 **Medium:** ¿Qué condiciones?
  - 🟠 **High:** ¿Qué condiciones?
  - 🔴 **Critical:** ¿Qué condiciones?
- Canales de notificación por severidad
- Tiempos de respuesta esperados (SLA)

**Respuesta:**
\`\`\`
[Pendiente]
\`\`\`

**Acciones Requeridas:**
- [ ] Definir umbrales por tipo de error
- [ ] Configurar sistema de alertas
- [ ] Documentar procedimientos de respuesta
- [ ] Establecer SLAs por severidad

---

## 4️⃣ CANARY DEPLOYMENT Y ROLLBACK

### Pregunta
**¿Tenemos canary deployment y rollback automático desde el mismo ticket/sistema?**

**Contexto:**
- Estrategia de despliegue seguro
- Capacidad de revertir cambios problemáticos
- Integración con sistema de tickets

**Impacto:**
- 🔴 Alto - Crítico para estabilidad en producción

**Información Requerida:**
- ¿Está configurado canary deployment?
- ¿Porcentaje de tráfico en canary?
- ¿Métricas monitoreadas para auto-rollback?
- ¿Integración con Jira/Linear/GitHub Issues?
- ¿Proceso manual o automático?

**Respuesta:**
\`\`\`
[Pendiente]
\`\`\`

**Acciones Requeridas:**
- [ ] Confirmar configuración de canary
- [ ] Documentar proceso de rollback
- [ ] Configurar métricas de monitoreo
- [ ] Integrar con sistema de tickets

---

## 5️⃣ PERMISOS DE ADMIN REVIEW WORKFLOW

### Pregunta
**¿Qué roles tienen acceso a `/admin/review-workflow`? ¿Cuál es la matriz de permisos?**

**Contexto:**
- Control de acceso a funcionalidades administrativas
- Workflow de revisión y aprobación
- Seguridad y compliance

**Impacto:**
- 🔴 Alto - Crítico para seguridad y compliance

**Información Requerida:**
- Roles definidos:
  - Super Admin
  - Admin
  - Content Manager
  - Reviewer
  - Editor
- Permisos por rol:
  - Ver contenido
  - Editar contenido
  - Aprobar/Rechazar
  - Publicar
  - Eliminar
  - Configurar workflow

**Respuesta:**
\`\`\`
[Pendiente]
\`\`\`

**Acciones Requeridas:**
- [ ] Definir matriz de roles y permisos
- [ ] Implementar control de acceso
- [ ] Documentar proceso de asignación de roles
- [ ] Configurar auditoría de accesos

---

## 6️⃣ CRON JOBS Y PERIODICIDAD

### Pregunta
**¿Cuál es la lista completa de cron jobs, su periodicidad y sistema de alertas?**

**Contexto:**
- Jobs automatizados en el sistema
- Monitoreo de ejecución
- Alertas de fallos

**Impacto:**
- 🟡 Medio - Importante para operaciones y mantenimiento

**Información Requerida:**

### Cron Jobs Conocidos:
1. **Recordatorios de WhatsApp**
   - Periodicidad: ¿?
   - Alertas: ¿?
   
2. **Generación de Insights Semanales**
   - Periodicidad: ¿?
   - Alertas: ¿?

3. **Limpieza de Datos Temporales**
   - Periodicidad: ¿?
   - Alertas: ¿?

4. **Actualización de Embeddings**
   - Periodicidad: ¿?
   - Alertas: ¿?

5. **Backup de Base de Datos**
   - Periodicidad: ¿?
   - Alertas: ¿?

6. **Análisis de Métricas**
   - Periodicidad: ¿?
   - Alertas: ¿?

**Respuesta:**
\`\`\`
[Pendiente]
\`\`\`

**Acciones Requeridas:**
- [ ] Documentar todos los cron jobs
- [ ] Definir periodicidad óptima
- [ ] Configurar alertas de fallo
- [ ] Implementar monitoreo de ejecución
- [ ] Crear dashboard de cron jobs

---

## 7️⃣ POLÍTICA DE RETENCIÓN DE DATOS

### Pregunta
**¿Cuál es la política de retención de datos por tipo (tests, logs, grabaciones, etc.)?**

**Contexto:**
- Compliance con GDPR/CCPA
- Optimización de almacenamiento
- Costos de infraestructura

**Impacto:**
- 🔴 Alto - Crítico para compliance y costos

**Información Requerida por Tipo de Dato:**

### 1. Resultados de Tests
- Retención: ¿?
- Archivado: ¿?
- Eliminación: ¿?

### 2. Logs de Sistema
- Retención: ¿?
- Archivado: ¿?
- Eliminación: ¿?

### 3. Conversaciones de IA
- Retención: ¿?
- Archivado: ¿?
- Eliminación: ¿?

### 4. Grabaciones/Sesiones
- Retención: ¿?
- Archivado: ¿?
- Eliminación: ¿?

### 5. Datos de Usuario
- Retención: ¿?
- Archivado: ¿?
- Eliminación: ¿?

### 6. Métricas y Analytics
- Retención: ¿?
- Archivado: ¿?
- Eliminación: ¿?

**Respuesta:**
\`\`\`
[Pendiente]
\`\`\`

**Acciones Requeridas:**
- [ ] Definir política de retención por tipo
- [ ] Implementar proceso de archivado automático
- [ ] Configurar eliminación automática
- [ ] Documentar proceso de recuperación
- [ ] Configurar alertas de almacenamiento

---

## 8️⃣ DSAR (DATA SUBJECT ACCESS REQUEST)

### Pregunta
**¿Cuál es el estado del sistema DSAR para descarga y borrado de datos por usuario?**

**Contexto:**
- Requerimiento legal GDPR/CCPA
- Derecho del usuario a:
  - Descargar sus datos
  - Solicitar eliminación
  - Rectificar información

**Impacto:**
- 🔴 Crítico - Requerimiento legal obligatorio

**Información Requerida:**

### Funcionalidades DSAR:
1. **Descarga de Datos**
   - ¿Implementado? ¿?
   - Formato: ¿JSON/CSV/PDF?
   - Tiempo de procesamiento: ¿?
   - Notificación al usuario: ¿?

2. **Eliminación de Datos**
   - ¿Implementado? ¿?
   - Alcance: ¿Qué se elimina?
   - Tiempo de procesamiento: ¿?
   - Confirmación: ¿?

3. **Rectificación de Datos**
   - ¿Implementado? ¿?
   - Proceso: ¿?
   - Validación: ¿?

4. **Auditoría**
   - ¿Se registran las solicitudes?
   - ¿Tiempo de respuesta?
   - ¿Reportes de compliance?

**Respuesta:**
\`\`\`
[Pendiente]
\`\`\`

**Acciones Requeridas:**
- [ ] Implementar descarga de datos
- [ ] Implementar eliminación de datos
- [ ] Crear proceso de rectificación
- [ ] Configurar auditoría de solicitudes
- [ ] Documentar proceso para usuarios
- [ ] Establecer SLA de respuesta (30 días GDPR)

---

## 9️⃣ ORIGEN Y LICENCIAS DE CONTENIDO

### Pregunta
**¿Cuál es el origen y las licencias de los libros y tests psicométricos (MBTI, DISC, etc.)?**

**Contexto:**
- Propiedad intelectual
- Riesgo legal
- Compliance con licencias

**Impacto:**
- 🔴 Crítico - Riesgo legal alto

**Información Requerida:**

### A. Libros (120+ títulos)
- **Origen:**
  - ¿Dominio público?
  - ¿Licencia adquirida?
  - ¿Acuerdo con editoriales?
  - ¿Creative Commons?

- **Licencias:**
  - Tipo de licencia por libro
  - Restricciones de uso
  - Atribución requerida
  - Límites de distribución

- **Documentación:**
  - ¿Contratos firmados?
  - ¿Registro de licencias?
  - ¿Renovaciones?

### B. Tests Psicométricos

#### MBTI (Myers-Briggs Type Indicator)
- **Origen:** ¿?
- **Licencia:** ¿The Myers-Briggs Company?
- **Costo:** ¿?
- **Restricciones:** ¿?

#### DISC
- **Origen:** ¿?
- **Licencia:** ¿?
- **Costo:** ¿?
- **Restricciones:** ¿?

#### Big Five
- **Origen:** ¿Dominio público/académico?
- **Licencia:** ¿?
- **Costo:** ¿?
- **Restricciones:** ¿?

#### RIASEC (Holland Code)
- **Origen:** ¿?
- **Licencia:** ¿?
- **Costo:** ¿?
- **Restricciones:** ¿?

#### Soft Skills Assessment
- **Origen:** ¿Desarrollo propio?
- **Licencia:** ¿?
- **Validación:** ¿?

**Respuesta:**
\`\`\`
[Pendiente]
\`\`\`

**Acciones Requeridas:**
- [ ] Auditar origen de todos los libros
- [ ] Verificar licencias de tests
- [ ] Obtener documentación legal
- [ ] Implementar atribuciones requeridas
- [ ] Crear registro de licencias
- [ ] Establecer proceso de renovación
- [ ] Consultar con legal si es necesario

---

## 🔟 COBERTURA DEL RAG (RETRIEVAL AUGMENTED GENERATION)

### Pregunta
**¿Cuál es la cobertura del sistema RAG: número de documentos, estrategia de chunking, citación y control de alucinación?**

**Contexto:**
- Sistema de IA para coaching
- Calidad de respuestas
- Confiabilidad del sistema

**Impacto:**
- 🟡 Medio-Alto - Afecta calidad del servicio

**Información Requerida:**

### A. Cobertura de Documentos
- **Número total de documentos:** ¿?
- **Tipos de documentos:**
  - Libros: ¿?
  - Artículos: ¿?
  - Guías: ¿?
  - Tests: ¿?
  - Otros: ¿?
- **Tamaño total:** ¿GB/MB?
- **Última actualización:** ¿?

### B. Estrategia de Chunking
- **Tamaño de chunks:** ¿tokens/caracteres?
- **Overlap entre chunks:** ¿?
- **Método de división:**
  - ¿Por párrafos?
  - ¿Por secciones?
  - ¿Semántico?
- **Preservación de contexto:** ¿Cómo?

### C. Sistema de Embeddings
- **Modelo usado:** ¿OpenAI/otro?
- **Dimensiones:** ¿?
- **Base de datos vectorial:** ¿Supabase pgvector?
- **Índice:** ¿Tipo y configuración?
- **Tiempo de búsqueda:** ¿ms promedio?

### D. Citación y Fuentes
- **¿Se incluyen citas en respuestas?** ¿?
- **Formato de citación:** ¿?
- **Link a fuente original:** ¿?
- **Confianza de la fuente:** ¿Score?

### E. Control de Alucinación
- **Estrategias implementadas:**
  - [ ] Threshold de similitud mínima
  - [ ] Verificación de fuentes
  - [ ] Respuesta "No sé" cuando no hay datos
  - [ ] Validación de coherencia
  - [ ] Fact-checking automático

- **Métricas de calidad:**
  - Tasa de alucinación: ¿?
  - Precisión de respuestas: ¿?
  - Relevancia de fuentes: ¿?

- **Monitoreo:**
  - ¿Sistema de feedback de usuarios?
  - ¿Revisión manual de respuestas?
  - ¿Alertas de baja calidad?

**Respuesta:**
\`\`\`
[Pendiente]
\`\`\`

**Acciones Requeridas:**
- [ ] Documentar cobertura actual del RAG
- [ ] Optimizar estrategia de chunking
- [ ] Implementar sistema de citación
- [ ] Mejorar control de alucinación
- [ ] Configurar métricas de calidad
- [ ] Crear dashboard de monitoreo RAG
- [ ] Establecer proceso de actualización de documentos

---

## 📊 SIGUIENTE PASO RECOMENDADO

### 1. Pruebas Inmediatas (HOY)
- [ ] **Smoke Tests:** Verificar funcionalidades críticas
- [ ] **Pruebas por Módulo:**
  - Tests psicométricos (6 tests)
  - Sistema de coaching IA (Sofia y Dani)
  - Biblioteca (lectura y progreso)
  - Dashboard y gamificación
  - Aplicaciones y tracking
  - Admin y métricas

### 2. Despliegue Controlado (SI TODO OK)
- [ ] **Habilitar Autopublish en Canary**
  - Configurar porcentaje de tráfico (5-10%)
  - Definir métricas de éxito
  - Configurar rollback automático
  
- [ ] **Monitoreo Intensivo**
  - Errores de API
  - Tiempos de respuesta
  - Tasa de conversión
  - Feedback de usuarios

### 3. Cierre de Sprint
- [ ] **Reunión de Retrospectiva**
  - Lecciones aprendidas
  - Qué funcionó bien
  - Qué mejorar
  
- [ ] **Backlog Priorizado**
  - Resolver preguntas pendientes de este documento
  - Priorizar features del roadmap
  - Asignar recursos
  
- [ ] **Documentación**
  - Actualizar documentación técnica
  - Actualizar documentación funcional
  - Crear runbooks operacionales

---

## 📋 CHECKLIST DE SEGUIMIENTO

### Preguntas Respondidas
- [ ] 1. Autopublicación
- [ ] 2. Historial y versionado
- [ ] 3. Umbrales de severidad
- [ ] 4. Canary y rollback
- [ ] 5. Permisos admin
- [ ] 6. Cron jobs
- [ ] 7. Retención de datos
- [ ] 8. DSAR
- [ ] 9. Licencias
- [ ] 10. Cobertura RAG

### Acciones Completadas
- [ ] Smoke tests ejecutados
- [ ] Pruebas por módulo completadas
- [ ] Canary deployment configurado
- [ ] Monitoreo activo
- [ ] Retrospectiva realizada
- [ ] Backlog priorizado
- [ ] Documentación actualizada

---

## 📞 CONTACTO Y ESCALACIÓN

**Para responder estas preguntas:**
- **Contacto:** Juan
- **Urgencia:** Alta
- **Deadline:** Antes del próximo sprint
- **Método:** [Email/Slack/Reunión]

**Escalación si no hay respuesta:**
- Nivel 1: Juan (Product Owner)
- Nivel 2: [CTO/Tech Lead]
- Nivel 3: [CEO/Founder]

---

## 📝 NOTAS ADICIONALES

\`\`\`
[Espacio para notas, comentarios o información adicional]
\`\`\`

---

**Última Actualización:** Enero 2025  
**Próxima Revisión:** [Fecha]  
**Responsable:** Equipo de Desarrollo DTC
