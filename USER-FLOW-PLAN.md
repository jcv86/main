# FLUJO USUARIO INTUITIVO - DESPEGA

## 1. DESPUÉS DEL ONBOARDING (Completó A1 - Test DISC)

### Usuario ve: RESULTADO + PRÓXIMO PASO (1 vista simple)
- Perfil DISC en grande: "Eres un Azul" con color y descripción
- Lo que significa: "Empático, relacional, orientado a personas"
- Progreso 90 días: Barra visual de 0%
- **ÚNICO BOTÓN GRANDE:** "Comencemos Tu Transformación" → /despega/dashboard

---

## 2. DASHBOARD POST-ONBOARDING (Corazón de la experiencia)

### Sección Superior - TU ESTADO ACTUAL (Tarjeta grande)
- **Perfil DISC** (Visual: círculo con colores D/I/S/C)
- Porcentaje: D: 30% | I: 45% | S: 20% | C: 5%
- Nombre y email
- Estado de energía (verde/naranja/rojo)

### Sección 2 - TU MISIÓN 90 DÍAS (Card destacada)
- Si aún no eligió: Dos opciones
  - "Camino Persona" (naranja) - Crecimiento personal
  - "Camino Profesional" (azul) - Carrera
- Si ya eligió: Muestra misión actual
  - Objetivo principal
  - Sprint actual (1/3)
  - Próximo hito

### Sección 3 - LOS 4 PILARES (Grid 2x2 o 1x4 responsive)

**A1: El Ritual** (Completado ✓)
- Icono: Quiz/Test
- Estado: "Test completado"
- Próximo: "-"

**A2: Rutas** (Actual)
- Icono: Mapa
- Estado: "En progreso"
- Próximo: "Elige tu camino"
- Botón: "Ir a Rutas"

**A3: Entrenamientos** (Próximo)
- Icono: Dumbbell
- Estado: "Esperando"
- Próximo: "Activa entrenamientos"
- Botón: "Ver entrenamientos"

**A4: Contexto** (Último)
- Icono: Globe
- Estado: "Por activar"
- Próximo: "Noticias personalizadas"
- Botón: "Ver noticias"

### Sección 4 - COACH IA (Sidebar o Card)
- Avatar Sofía/Dani
- Mensaje del día personalizado: "Hola, María. Veo que eres AZUL. Hoy iniciamos tu camino de relaciones..." 
- Botón: "Hablar con Coach"

### Sección 5 - ACCIONES RÁPIDAS
- 4 botones pequeños:
  1. "Mi Sprint" → A2
  2. "Mis Entrenamientos" → A3
  3. "Noticias" → A4
  4. "Mi Perfil" → Settings

### Sección 6 - NOTICIAS TICKER (Header)
- 1 noticia destacada rotando cada 8s
- Tema adaptado a su entrenamiento actual
- Botón "Ver todas"

---

## 3. FLUJO DE NAVEGACIÓN INTUITIVA

```
Usuario completa Test DISC
    ↓
Ve resultado ("Eres Azul") + botón "Comenzar"
    ↓
DASHBOARD (centro de todo)
    ├→ Elige A2 (Camino) → /despega/a2/camino
    ├→ Ve A3 (Entrenamientos) → /despega/a3
    ├→ Ve A4 (Noticias) → /despega/a4/noticias
    └→ Habla con Coach → Sidebar chat
```

---

## 4. INDICADORES VISUALES

### Estados
- ✓ Completado: Checkmark verde
- ⏳ En progreso: Reloj azul
- ⟶ Próximo: Flecha gris

### Colores por Perfil DISC
- **Azul:** #2563EB (Azul profesional)
- **Rojo:** #DC2626 (Rojo energético)
- **Amarillo:** #FBBF24 (Amarillo cálido)
- **Verde:** #10B981 (Verde equilibrio)
- **Neutral:** #6B7280 (Gris)

---

## 5. MOBILE-FIRST RESPONSIVE

**Desktop:** 
- Stats cards en fila
- Pilares en grid 2x2
- Coach sidebar derecha

**Tablet:**
- Stats stacked
- Pilares 2x2
- Coach sidebar móvil

**Mobile:**
- Stats apilados
- Pilares 1 columna
- Coach en chat button flotante

---

## 6. COMPONENTES A CREAR

1. `DashboardHero` - Perfil DISC grande
2. `MissionCard` - Misión 90 días
3. `PillarCard` - Cada pilar (A1/A2/A3/A4)
4. `CoachWidget` - Coach IA mini
5. `ResultScreen` - Pantalla post-test
6. `QuickActionsBar` - 4 botones rápidos

---

## 7. DATOS QUE NECESITA EL DASHBOARD

```typescript
interface UserDashboard {
  // Del perfil
  name: string
  email: string
  perfil_disc: { D: number; I: number; S: number; C: number }
  dominante: "D" | "I" | "S" | "C"
  
  // De A1
  a1_completed: boolean
  a1_results: any
  
  // De A2
  a2_mission?: {
    id: string
    titulo: string
    objetivo: string
    camino: "persona" | "profesional"
    sprint_actual: number
    progreso: number
  }
  
  // De A3
  a3_entrenamientos?: []
  
  // De A4
  a4_noticias?: []
  
  // Coach
  coach_context?: CoachContext
}
```

Este es el flujo completo. El dashboard es el corazón, y todo se accede desde ahí.
