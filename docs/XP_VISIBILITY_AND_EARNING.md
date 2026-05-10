## XP Visibility & Earning System - Complete Guide

### USER ALWAYS SEES THEIR SCORE - 3 LOCATIONS:

#### 1. NAVBAR (Always Visible)
- **Compact XP Badge** - Top right of every page
- Shows: XP count + Current Level + Daily Streak (🔥)
- Updates: Every 30 seconds
- Click to go to Progress page
- Help button (?) opens XP Guide Modal

#### 2. BOTTOM-RIGHT WIDGET (Always Visible)
- **PremiumGamificationWidget** - Fixed position
- Shows: Streak, XP progress bar, level, challenges, achievements
- Most detailed view
- Appears on all Despega pages
- Refresh every 30 seconds

#### 3. NOTIFICATIONS (Real-time)
- **XP Toast Notifications** - Top center
- Appears when user gains XP
- Shows: +XP amount, action description
- Auto-dismisses after 3 seconds
- Motivates immediate feedback

---

### HOW TO GAIN XP - CRYSTAL CLEAR:

#### Method 1: XP GUIDE MODAL
- User clicks (?) button in navbar
- Modal opens with 3 tabs:
  - **Actividades**: All ways to earn XP by phase
  - **Racha**: Streak bonuses (3→7→14→30 days = x1.25→1.5→1.75→2x XP)
  - **Niveles**: Explanation of level system (1,000 XP per level)

#### Method 2: VISIBLE IN EACH ACTIVITY
- Every page shows what XP you'll earn
- Example: "Análisis Multimodal: +250 XP"
- Makes it obvious BEFORE doing the activity

#### Method 3: IMMEDIATE FEEDBACK
- Toast notification fires when XP gained
- "+250 XP - Análisis Multimodal Completado"
- User sees INSTANT confirmation

#### Method 4: PROGRESS PAGE
- `/despega/progress` shows lifetime XP breakdown
- Shows XP earned per phase
- Shows streak history
- Shows achievements unlocked

---

### SPECIFIC XP VALUES BY ACTIVITY:

**EL RITUAL (A1)**
- Conozcámonos 1: +100 XP
- Test de Perfil: +150 XP
- Tu Análisis: +50 XP

**EXPLORACIÓN (A2)**
- Define Tus Objetivos: +100 XP
- Generar Ruta: +200 XP
- Daily Check-in: +10 XP (boosts streak)

**ENTRENAMIENTO (A3)**
- Interview 0: +150 XP
- Simulación Guiada: +200 XP
- Análisis Multimodal (Video): +250 XP (biggest in A3)
- Simulación Estructurada: +200 XP
- Ajuste por Vacante: +150 XP
- Simulación Desafiante: +300 XP (hardest = most XP)

**LA REALIDAD (A4)**
- Contexto del Mercado: +100 XP
- Dashboard Ejecutivo: +150 XP
- Desafío Diario A4: +75 XP

**STREAK BONUSES**
- 3 días: x1.25 (all XP multiplied)
- 7 días: x1.5 (all XP multiplied)
- 14 días: x1.75 (all XP multiplied)
- 30 días: x2.0 (ALL XP DOUBLED)

---

### USER JOURNEY TO SEE & INCREASE XP:

1. **Login** → User sees XP badge in navbar (0 to start)

2. **First Activity** (Conozcámonos 1)
   - User completes form
   - Toast: "+100 XP - Conozcámonos 1 Completado"
   - Navbar updates instantly
   - XP badge now shows "100 XP | Lv. 1"

3. **Wants to Know More** 
   - User clicks (?) button in navbar
   - Modal opens: "Guía Completa de XP"
   - Sees all activities = all possible XP amounts
   - Sees streak system (motivation!)
   - Sees level explanation (1,000 XP = 1 level)

4. **Continues Journey**
   - Each activity shows XP reward before starting
   - After completing: Toast notification
   - Navbar updates (sometimes instant, max 30 sec)
   - Bottom widget also updates

5. **Builds Streak**
   - Day 1: Returns next day
   - Toast: "🔥 Racha: 2 días!"
   - Streak bonus: x1.25 multiplier on ALL XP
   - User motivated to not break streak

6. **Reaches 7-Day Streak**
   - Major unlock: x1.5 multiplier
   - User realizes: "If I practice more now, I get 50% bonus XP!"
   - Gamification psychology kicks in

7. **Reaches Level 2**
   - After 1,000 XP
   - Toast: "🎉 LEVEL UP! Ahora Lv. 2"
   - Navbar shows "Lv. 2"
   - Unlock special achievement badge

---

### TRANSPARENCY EVERYWHERE:

**Before Activity**: 
- "Complete Análisis Multimodal: +250 XP"

**During Activity**: 
- Navbar shows live updates

**After Activity**: 
- Toast: "+250 XP"
- Navbar updates
- Widget updates

**Anytime User Wants Details**:
- Click (?) for full guide
- Go to `/despega/progress` for full breakdown
- Widget shows challenges, streak, next unlock

---

### PSYCHOLOGY OF THE SYSTEM:

- **Immediate Gratification**: Toast notification right after activity
- **Always Visible**: 3 places show score (navbar, widget, progress)
- **Clarity**: Every single XP value is known in advance
- **Streak Mechanics**: "Don't break your streak" drives daily engagement
- **Level Progression**: 1,000 XP per level feels achievable
- **Multipliers**: 7-day streak x1.5 motivates back-to-back days
- **Achievement Unlock**: Special badges for milestones

---

### IMPLEMENTATION IN CODE:

1. **triggerXPGain(250, "Análisis Multimodal")** - Fire toast
2. **XPNotificationCenter** - Listens for xp-gain events
3. **XPNavbarBadge** - Updates every 30 sec from API
4. **PremiumGamificationWidget** - Always visible, auto-refresh
5. **XPGuideModal** - Complete transparency on earning
