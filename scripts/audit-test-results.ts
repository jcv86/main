import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Faltan variables de entorno Supabase")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function auditTestResults() {
  console.log("\n" + "=".repeat(70))
  console.log("🔍 AUDITORÍA: Guardado de Resultados DISC en Base de Datos")
  console.log("=".repeat(70))

  try {
    // 1. Verificar tabla despega_a1_test_results
    console.log("\n1️⃣  TABLA: despega_a1_test_results")
    console.log("-".repeat(60))

    const { data: a1Results, error: a1Error, count: a1Count } = await supabase
      .from("despega_a1_test_results")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .limit(5)

    if (a1Error) {
      console.error("❌ Error accediendo despega_a1_test_results:", a1Error.message)
    } else {
      console.log(`✅ Total registros: ${a1Count}`)
      console.log(`📈 Últimos 5 registros:`)
      a1Results?.forEach((result, idx) => {
        console.log(`\n  ${idx + 1}. User ID: ${result.user_id}`)
        console.log(`     Score Total: ${result.score_total}%`)
        console.log(`     Resultados: ${JSON.stringify(result.resultados)}`)
        console.log(`     Diagnóstico: ${result.diagnostico}`)
        console.log(`     Guardado: ${result.created_at}`)
      })
    }

    // 2. Verificar tabla unified_test_results
    console.log("\n2️⃣  TABLA: unified_test_results")
    console.log("-".repeat(60))

    const { data: unifiedResults, error: unifiedError, count: unifiedCount } = await supabase
      .from("unified_test_results")
      .select("*", { count: "exact" })
      .eq("test_type", "disc")
      .order("created_at", { ascending: false })
      .limit(5)

    if (unifiedError) {
      console.error("❌ Error accediendo unified_test_results:", unifiedError.message)
    } else {
      console.log(`✅ Total registros DISC: ${unifiedCount}`)
      console.log(`📈 Últimos 5 registros:`)
      unifiedResults?.forEach((result, idx) => {
        console.log(`\n  ${idx + 1}. User Email: ${result.user_email}`)
        console.log(`     Test Type: ${result.test_type}`)
        console.log(`     Results: ${JSON.stringify(result.test_results)}`)
        console.log(`     Guardado: ${result.created_at}`)
      })
    }

    // 3. Verificar tabla despega_user_profiles
    console.log("\n3️⃣  TABLA: despega_user_profiles")
    console.log("-".repeat(60))

    const { data: profiles, error: profileError, count: profileCount } = await supabase
      .from("despega_user_profiles")
      .select("*", { count: "exact" })
      .eq("a1_test_completed", true)
      .order("updated_at", { ascending: false })
      .limit(5)

    if (profileError) {
      console.error("❌ Error accediendo despega_user_profiles:", profileError.message)
    } else {
      console.log(`✅ Total usuarios con A1 completado: ${profileCount}`)
      console.log(`📈 Últimos 5:`)
      profiles?.forEach((profile, idx) => {
        console.log(`\n  ${idx + 1}. User ID: ${profile.user_id}`)
        console.log(`     Camino Persona: ${profile.camino_persona_active ? "✅" : "❌"}`)
        console.log(`     Camino Profesional: ${profile.camino_profesional_active ? "✅" : "❌"}`)
        console.log(`     A1 Completado: ${profile.a1_test_completed ? "✅" : "❌"}`)
        console.log(`     Actualizado: ${profile.updated_at}`)
      })
    }

    // 4. Verificar tabla despega_rankings
    console.log("\n4️⃣  TABLA: despega_rankings")
    console.log("-".repeat(60))

    const { data: rankings, error: rankingError, count: rankingCount } = await supabase
      .from("despega_rankings")
      .select("*", { count: "exact" })
      .gt("score_a1_cerebral", 0)
      .order("score_general", { ascending: false })
      .limit(5)

    if (rankingError) {
      console.error("❌ Error accediendo despega_rankings:", rankingError.message)
    } else {
      console.log(`✅ Total usuarios con score A1: ${rankingCount}`)
      console.log(`📈 Top 5:`)
      rankings?.forEach((rank, idx) => {
        console.log(`\n  ${idx + 1}. User ID: ${rank.user_id}`)
        console.log(`     Score A1: ${rank.score_a1_cerebral}%`)
        console.log(`     Score General: ${rank.score_general}%`)
      })
    }

    // 5. Resumen de Integridad
    console.log("\n5️⃣  RESUMEN DE INTEGRIDAD")
    console.log("-".repeat(60))

    const allTablesOk = !a1Error && !unifiedError && !profileError && !rankingError

    if (allTablesOk) {
      console.log("✅ Todas las tablas accesibles")
      console.log(`   • A1 Test Results: ${a1Count} registros`)
      console.log(`   • Unified Results: ${unifiedCount} registros`)
      console.log(`   • User Profiles: ${profileCount} registros`)
      console.log(`   • Rankings: ${rankingCount} registros`)

      if (a1Count === 0) {
        console.warn("\n⚠️  ADVERTENCIA: No hay registros en despega_a1_test_results")
      }
      if (unifiedCount === 0) {
        console.warn("⚠️  ADVERTENCIA: No hay registros en unified_test_results")
      }
    } else {
      console.error("❌ Algunas tablas tuvieron errores de acceso")
    }

    console.log("\n" + "=".repeat(70))
    console.log("Auditoría completada\n")
  } catch (error) {
    console.error("❌ Error durante auditoría:", error)
    process.exit(1)
  }
}

auditTestResults()
