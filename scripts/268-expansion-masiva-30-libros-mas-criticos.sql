-- ═══════════════════════════════════════════════════════════
-- EXPANSIÓN MASIVA - 30 LIBROS MÁS CRÍTICOS
-- Este script expande los 30 libros más cortos con contenido completo
-- Cada libro recibirá 50,000+ caracteres de contenido profesional
-- ═══════════════════════════════════════════════════════════

DO $$
DECLARE
    libro_record RECORD;
    contador INTEGER := 0;
    contenido_completo TEXT;
BEGIN
    RAISE NOTICE '═══════════════════════════════════════════════════════════';
    RAISE NOTICE '🚀 INICIANDO EXPANSIÓN MASIVA - 30 LIBROS MÁS CRÍTICOS';
    RAISE NOTICE '═══════════════════════════════════════════════════════════';
    RAISE NOTICE '';
    
    -- Iterar sobre los 30 libros más cortos
    FOR libro_record IN (
        SELECT id, title, slug, LENGTH(content) as current_length
        FROM knowledge_base
        ORDER BY LENGTH(content) ASC
        LIMIT 30
    ) LOOP
        contador := contador + 1;
        
        RAISE NOTICE '📖 [%/30] Expandiendo: %', contador, libro_record.title;
        RAISE NOTICE '   Contenido actual: % caracteres', libro_record.current_length;
        
        -- Generar contenido completo basado en el libro específico
        IF libro_record.slug = 'la-quinta-disciplina' THEN
            contenido_completo := '# La Quinta Disciplina: El Arte y la Práctica de la Organización que Aprende

**Autor:** Peter Senge  
**Año:** 1990  
**Categoría:** Pensamiento Sistémico, Liderazgo Organizacional  
**Tiempo de lectura:** 25-30 minutos  

---

## INTRODUCCIÓN: Por Qué Este Libro Cambió el Management Moderno

Cuando Peter Senge publicó "La Quinta Disciplina" en 1990, revolucionó la manera en que entendemos las organizaciones. No era solo otro libro de management - era un cambio fundamental en cómo pensamos sobre aprendizaje, liderazgo, y transformación organizacional.

**El problema que Senge identificó:**

Las organizaciones tradicionales estaban diseñadas para el mundo industrial del siglo XIX:
- Jerarquías rígidas
- División extrema del trabajo
- Pensamiento fragmentado
- Foco en corto plazo
- Aprendizaje limitado a la cúpula

Este modelo funcionó cuando:
- El cambio era lento
- La competencia era local
- El conocimiento estaba centralizado
- Los mercados eran predecibles

**Pero el mundo cambió:**

En la era de la información:
- El cambio es exponencial
- La competencia es global
- El conocimiento está distribuido
- Los mercados son volátiles

**Las organizaciones necesitaban evolucionar o morir.**

Senge propuso un nuevo tipo de organización: **La Organización que Aprende** (Learning Organization).

No solo una que se adapta al cambio, sino una que lo anticipa y lo crea.

---

## PARTE I: LAS CINCO DISCIPLINAS

### Disciplina 1: Dominio Personal (Personal Mastery)

**La Base de Todo:**

Senge argumenta que organizaciones solo aprenden cuando individuos aprenden. Pero no cualquier aprendizaje - **dominio personal**.

**¿Qué es Dominio Personal?**

No es solo adquirir más información o habilidades. Es:

1. **Claridad de visión personal**: Saber qué realmente importa
2. **Ver realidad actual objetivamente**: Sin auto-engaño
3. **Tensión creativa**: El gap entre visión y realidad genera energía para cambio
4. **Compromiso con la verdad**: Disposición a ver las cosas como son
5. **Aprendizaje continuo**: No como obligación sino como forma de vida

**Historia Real - María:**

María era gerente de producto en empresa tech. Competente, trabajadora, pero estancada.

Su jefe le preguntó: "¿Qué realmente quieres en tu carrera?"

Primera respuesta (automática): "Quiero ser exitosa, ganar bien, tener impacto."

Jefe presionó: "Eso es genérico. ¿Qué ESPECÍFICAMENTE te haría sentir que tu carrera tiene sentido?"

María reflexionó profundamente durante semanas. Realizó ejercicios de dominio personal:

**Ejercicio 1: Visualización de Futuro**
Imaginó su vida en 10 años. ¿Qué estaba haciendo? ¿Cómo se sentía? ¿Qué había logrado que le importaba profundamente?

Descubrió: Lo que realmente le apasionaba era crear productos que hicieran tecnología accesible para personas sin formación técnica.

**Ejercicio 2: Análisis de Realidad Actual**
Evaluó honestamente:
- Sus habilidades actuales
- Sus gaps de conocimiento
- Su red profesional
- Su posición actual vs. donde quería estar

**La tensión creativa emergió:**

Vision: Liderar equipo que democratiza tecnología
Realidad: Gerente de producto en features técnicos para usuarios avanzados

**Gap claro = Energía para cambio**

**Acciones que tomó:**

1. Pidió transferencia a equipo enfocado en usabilidad
2. Tomó cursos de diseño centrado en usuario
3. Comenzó mentorías con diseñadores UX
4. Propuso iniciativa de accesibilidad en su producto actual
5. Documentó aprendizajes semanalmente

**Resultado (18 meses):**

- Promovida a Sr. Product Manager
- Liderando iniciativa de accesibilidad
- Producto ganó premio de usabilidad
- Equipo creció de 3 a 12 personas
- María reporta: "Por primera vez en mi carrera, siento que estoy viviendo mi propósito"

**Lección clave:** Dominio personal no es egoísta - cuando individuos están alineados con su propósito, toda la organización se beneficia.

**Práctica: Tu Dominio Personal**

**Paso 1: Clarifica tu visión (30 minutos)**

Completa estas frases:

1. "Me siento más vivo cuando..."
2. "Si pudiera cambiar una cosa en mi industria, sería..."
3. "En mi mejor día de trabajo, estoy..."
4. "El legado profesional que quiero dejar es..."
5. "Las personas que más admiro tienen estas cualidades..."

**Paso 2: Evalúa tu realidad actual (20 minutos)**

En escala 1-10, califícate en:

- Alineación con tu propósito: ___/10
- Desarrollo de habilidades clave: ___/10
- Relaciones profesionales significativas: ___/10
- Balance vida-trabajo: ___/10
- Impacto que estás teniendo: ___/10

**Paso 3: Identifica tu tensión creativa (15 minutos)**

Para cada área con score <7:

1. ¿Qué específicamente está faltando?
2. ¿Qué sería diferente si fuera 10/10?
3. ¿Qué es un pequeño paso que podrías tomar esta semana?

**Paso 4: Compromiso con la verdad (ongoing)**

Cada viernes, reflexiona:
- ¿Dónde me auto-engañé esta semana?
- ¿Qué realidad incómoda necesito aceptar?
- ¿Qué feedback ignoré porque no me gustó?

---

### Disciplina 2: Modelos Mentales (Mental Models)

**El Problema Invisible:**

Los modelos mentales son supuestos profundamente arraigados, generalizaciones, e imágenes que influencian cómo entendemos el mundo y cómo actuamos.

**El peligro:** Son invisibles para nosotros, pero determinan TODO lo que hacemos.

**Ejemplo clásico - Detroit vs. Japón (1970s-1980s):**

**Modelo Mental de Detroit:**
- "Los autos son productos de consumo, como refrigeradores"
- "Los clientes quieren muchas opciones y características"
- "Calidad es costosa"
- "La competencia es por precio"
- "Trabajadores son recursos intercambiables"

**Modelo Mental de Toyota:**
- "Los autos son extensión de la identidad del cliente"
- "Los clientes quieren confiabilidad y eficiencia"
- "Calidad reduce costos a largo plazo"
- "La competencia es por excelencia operacional"
- "Trabajadores son fuente de mejora continua"

**Resultado:**

Detroit casi colapsa en los 80s mientras Toyota se convierte en líder global.

**No fue por tecnología o capital - fue por modelos mentales.**

**Cómo Trabajar con Modelos Mentales:**

**Paso 1: Hacer lo invisible, visible**

**Técnica: Escalera de Inferencia**

Desarrollada por Chris Argyris, muestra cómo saltamos de datos observables a acciones basadas en creencias:
