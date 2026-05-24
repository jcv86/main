# 🎯 CÓMO EJECUTAR LOS SCRIPTS SQL EN SUPABASE

## El Problema
Los scripts SQL que ves en v0 son solo archivos de texto. v0 no puede ejecutarlos contra tu base de datos. Necesitas copiarlos manualmente a Supabase.

## Solución: Ejecutar en Supabase SQL Editor

### Paso 1: Abrir Supabase SQL Editor
1. Ve a https://supabase.com/dashboard
2. Selecciona tu proyecto
3. En el menú izquierdo, haz clic en **"SQL Editor"**
4. Haz clic en **"New query"**

### Paso 2: Copiar el Script
1. En v0, abre el archivo del script (por ejemplo: `scripts/270-expansion-funcional-primeros-30-libros.sql`)
2. Selecciona TODO el contenido (Ctrl+A o Cmd+A)
3. Copia (Ctrl+C o Cmd+C)

### Paso 3: Pegar y Ejecutar
1. Pega el contenido en el SQL Editor de Supabase
2. Haz clic en **"Run"** o presiona **Ctrl+Enter** (Cmd+Enter en Mac)
3. Espera a que termine de ejecutar (puede tomar 30-60 segundos para scripts grandes)

### Paso 4: Verificar Resultados
1. La consola mostrará los resultados
2. Busca mensajes como "✅ EXPANSIÓN COMPLETADA"
3. Verifica las estadísticas mostradas

## Scripts Que Debes Ejecutar en Orden

### 1. Script 270 (Expansión de Contenido)
**Archivo:** `scripts/270-expansion-funcional-primeros-30-libros.sql`

**Qué hace:**
- Expande 30 libros con contenido completo (50,000+ caracteres cada uno)
- Actualiza "La Quinta Disciplina" con contenido detallado
- Actualiza "Comunicación No Violenta" con contenido completo
- Actualiza otros 28 libros con contenido profesional extenso

**Tiempo estimado:** 30-60 segundos

### 2. Script 269 (Verificación)
**Archivo:** `scripts/269-verificar-ejecucion-script-268.sql`

**Qué hace:**
- Verifica que los libros fueron actualizados
- Muestra estadísticas de la biblioteca
- Identifica libros que aún necesitan expansión

**Tiempo estimado:** 5-10 segundos

## Alternativa: Usar la Consola de Supabase (Línea de Comandos)

Si prefieres usar la terminal:

\`\`\`bash
# Instalar Supabase CLI (si no lo tienes)
npm install -g supabase

# Iniciar sesión
supabase login

# Ejecutar script
supabase db execute -f scripts/270-expansion-funcional-primeros-30-libros.sql
\`\`\`

## ⚠️ Importante

1. **No cierres la pestaña** mientras el script se ejecuta
2. **Espera a que termine** completamente antes de ejecutar otro script
3. **Lee los mensajes** de la consola para confirmar éxito
4. **Si hay error**, copia el mensaje completo y compártelo

## ✅ Cómo Saber Si Funcionó

Después de ejecutar script 270, deberías ver:

\`\`\`
✅ EXPANSIÓN COMPLETADA

libros_actualizados: 30
promedio_caracteres: 50000
minimos_promedio_lectura: 250 min
\`\`\`

Si ves esto, ¡funcionó! 🎉

## 🔄 Si Algo Sale Mal

Si el script falla:
1. Copia el mensaje de error completo
2. Verifica que estás en el proyecto correcto de Supabase
3. Verifica que la tabla `knowledge_base` existe
4. Comparte el error para ayudarte a solucionarlo
