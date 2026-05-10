# XP Visibility & Earning System - Complete Guide

## Cómo el Usuario SIEMPRE VE Su Puntaje

### 1. XP Navbar Badge (SIEMPRE VISIBLE)
**Ubicación**: Top navbar, lado derecho (antes del botón Salir)
**Muestra**:
- Total XP (ej: "1,250 XP")
- Nivel actual (ej: "Lv. 2")
- Racha diaria (ej: "🔥 7" si está activo)
- **Clickeable**: Lleva a página completa `/despega/progress`

**Actualización**: Cada 60 segundos automáticamente

### 2. Premium Gamification Widget (SIEMPRE VISIBLE)
**Ubicación**: Fixed en bottom-right de pantalla
**Muestra**:
- XP progress bar hacia siguiente nivel
- Racha actual con multiplicador
- 3 desafíos diarios
- Badges desbloqueados
- Ranking semanal

**Actualización**: Cada 30 segundos automáticamente

### 3. Página de Progreso Completa
**URL**: `/despega/progress`
**Acceso**: Click en el XP Badge del navbar
**Muestra**:
- Guía visual: "¿Cómo ganar XP?"
- Todas las acciones que dan XP
- Valor de cada acción
- Sistema de racha y multiplicadores
- Tabla de niveles
- Tips para maximizar

---

## Cómo Sube Su Puntaje - Sistema de Acciones

### Actions que dan XP (Automáticas)

**Diarias** (Se repiten cada día):
- Iniciar sesión: +10 XP
- Completar 1 desafío: +25 XP
- Completar 3 desafíos (bonus): +50 XP

**Fase A1: El Ritual** (Una sola vez):
- Completar "Inicia Tu Jornada": +50 XP
- Completar "Descubre Tu Potencial": +75 XP
- Completar test: +100 XP
- Ver análisis personal: +50 XP
- **Bonus fase completa**: +200 XP

**Fase A2: Exploración**:
- Completar "Define Tus Objetivos": +75 XP
- Generar ruta: +100 XP
- Revisar ruta: +50 XP
- **Bonus fase completa**: +250 XP

**Fase A3: Entrenamiento**:
- Interview 0: +75 XP
- 1 Simulación Guiada: +150 XP
- Análisis Multimodal con Video: +200 XP
- CV ATS: +75 XP
- Ajuste por Vacante: +100 XP
- 1 Simulación Estructurada: +150 XP
- 1 Simulación Desafiante: +200 XP
- **Bonus fase completa**: +500 XP

**Fase A4: La Realidad**:
- Ver Contexto del Mercado: +75 XP
- Acceder Dashboard Ejecutivo: +100 XP
- Usar 3+ herramientas: +150 XP
- Tomar decisión estratégica: +100 XP
- **Bonus fase completa**: +500 XP

### Sistema de Racha Multiplicador

```
3 días   → x1.2
7 días   → x1.5
14 días  → x2.0
30 días  → x2.0 + Badge Leyenda
```

**Cómo funciona**:
- Si usuario tiene racha de 7+ días, TODOS los XP se multiplican x2
- Racha se reinicia si no hace actividad en 24 horas
- Visible con 🔥 en navbar

### Progresión de Niveles

```
Nivel 1-5   (0 - 5,000 XP)     = Novato
Nivel 6-15  (5,001 - 15,000)   = Intermedio
Nivel 16+   (15,001+)          = Experto
```

1 nivel = 1,000 XP

---

## Visibilidad en Tiempo Real

### XP Popup Animation
**Cuándo aparece**: Cada vez que usuario gana XP
**Dónde**: Bottom-right, encima del widget
**Muestra**:
- Acción completada
- XP ganados
- Multiplicador (si aplica)
- **LEVEL UP!** (si sube de nivel)

**Duración**: 3.5 segundos con animación de salida

### Actualización de Badges
**Cuándo**: Después de cada acción importante
**Badge color**: Cambia según tipo de XP
- Amarillo = XP normal
- Naranja = Con multiplicador
- Dorado = Level up

---

## Integración en Toda la App

### 1. Navbar Siempre Visible
```
[Menu Navigation] ... [XP Badge: 1,250 XP | Lv. 2 | 🔥 7] [Logout]
```

### 2. Popup en Acciones
Cuando usuario:
- Completa simulación → +150 XP popup
- Termina test → +100 XP popup
- Genera ruta → +100 XP popup
- Sube de nivel → LEVEL UP popup

### 3. Widget Persistente
Bottom-right corner en TODAS las páginas de `/despega/*`

### 4. Page de Referencia
`/despega/progress` = Guía completa visible siempre

---

## Best Practices Implementadas

✅ **Constant Visibility**: XP score visible en navbar + widget
✅ **Immediate Feedback**: Popup muestra XP ganados al instante
✅ **Streak Motivation**: 🔥 multiplicador motiva login diario
✅ **Clear Path to More**: Página progress muestra exactamente cómo ganar
✅ **Celebration Moments**: Level up con animación dorada
✅ **Auto-refresh**: Datos se actualizan sin refresh manual
✅ **Mobile Responsive**: XP badge responsive en mobile
✅ **Phase-based Progression**: XP escalado por fase de usuario

---

## Cómo Implementarlo en Acciones

### En cualquier página donde hagas una acción importante:

```typescript
import { useXPTracking } from '@/hooks/use-xp-tracking'

export function MyComponent() {
  const { recordXPGain, xpEvent, clearXPEvent } = useXPTracking()
  const { user } = useUser()

  const handleCompletionAction = async () => {
    // ... tu lógica
    
    // Registrar XP
    await recordXPGain(
      user.email,
      "Completó Simulación Guiada",
      150  // XP amount
    )
  }

  return (
    <>
      <YourContent onClick={handleCompletionAction} />
      {xpEvent && <XPPopup {...xpEvent} onComplete={clearXPEvent} />}
    </>
  )
}
```

---

## Resultado Final

El usuario **NUNCA se pregunta**:
- ¿Cuántos puntos tengo? → Está en navbar
- ¿Cómo subo mis puntos? → `/despega/progress` lo explica
- ¿Gané puntos? → Popup lo muestra al instante
- ¿Qué multiplicador tengo? → Visible en widget + navbar

**La gamificación es transparente, motivadora y siempre presente.**
