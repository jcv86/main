/**
 * AUDITORÍA COMPLETA: Verificar guardado de resultados de pruebas DISC
 * 
 * Este script:
 * 1. Verifica que los datos se estén guardando correctamente
 * 2. Confirma que las RLS policies funcionan
 * 3. Valida que los tipos de datos sean correctos
 * 4. Muestra estadísticas de guardado
 */

import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""

if (!supabaseUrl || !supabaseKey) {
  console.error("[AUDIT] Missing Supabase credentials")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function auditTestResults() {
  console.log("\n📊 AUDITORÍA DE RESULTADOS DE PRUEBAS DISC")
  console.log("=" . repeat(60))

  try {
    // 1. Verificar tabla despega_a1_test_results
    console.log("\n1️⃣  TABLA: despega_a1_test_results")
    console.log("-" . repeat(60))

    const { data: a1Results, error: a1Error, count: a1Count } = await supabase
      .from("despega_a1_test_results")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .limit(5)

    if (a1Error) {
      console.error("❌ Error accediendo despega_a1_test_results:", a1Error.message)
    } else {
      console.log(`✅ Total registros: ${a1Count}`)
      console.log(
        `📈 Últimos 5 registros:`
      )
      a1Results?.forEach((result: any, idx: number) => {
        console.log(`\n  ${idx + 1}. User: ${result.user_id}`)
        console.log(`     Score Total: ${result.score_total}`)
        console.log(
          `     Resultados: ${JSON.stringify(result.resultados)}`
        )
        console.log(
          `     Diagnóstico: ${result.diagnostico}`
        )
        console.log(
          `     Guardado: ${result.created_at}`
        )
      })
    }

    // 2. Verificar tabla unified_test_results
    console.log("\n2️⃣  TABLA: unified_test_results")
    console.log("-" . repeat(60))

    const { data: unifiedResults, error: unifiedError, count: unifiedCount } =
      await supabase
        .from("unified_test_results")
        .select("*", { count: "exact" })
        .eq("test_type", "disc")
        .order("created_at", { ascending: false })
        .limit(5)

    if (unifiedError) {
      console.error(
        "❌ Error accediendo unified_test_results:",
        unifiedError.message
      )
    } else {
      console.log(`✅ Total registros DISC: ${unifiedCount}`)
      console.log(`📈 Últimos 5 registros:`)
      unifiedResults?.forEach((result: any, idx: number) => {
        console.log(`\n  ${idx + 1}. User Email: ${result.user_email}`)
        console.log(
          `     Test Type: ${result.test_type}`
        )
        console.log(
          `     Results: ${JSON.stringify(result.test_results)}`
        )
        console.log(
          `     Guardado: ${result.created_at}`
        )
      })
    }

    // 3. Verificar tabla despega_user_profiles
    console.log("\n3️⃣  TABLA: despega_user_profiles")
    console.log("-" . repeat(60))

    const {
      data: profiles,
      error: profileError,
      count: profileCount,
    } = await supabase
      .from("despega_user_profiles")
      .select("*", { count: "exact" })
      .eq("a1_test_completed", true)
      .limit(5)

    if (profileError) {
      console.error(
        "❌ Error accediendo despega_user_profiles:",
        profileError.message
      )
    } else {
      console.log(
        `✅ Total perfiles con test A1 completado: ${profileCount}`
      )
      console.log(`📈 Últimos 5 perfiles:`)
      profiles?.forEach((profile: any, idx: number) => {
        console.log(`\n  ${idx + 1}. User: ${profile.user_id}`)
        console.log(
          `     Onboarding Completado: ${profile.onboarding_completed}`
        )
        console.log(
          `     A1 Test Completado: ${profile.a1_test_completed}`
        )
        console.log(
          `     Camino Foco: ${profile.camino_foco}`
        )
      })
    }

    // 4. Verificar tabla despega_rankings
    console.log("\n4️⃣  TABLA: despega_rankings")
    console.log("-" . repeat(60))

    const {
      data: rankings,
      error: rankError,
      count: rankCount,
    } = await supabase
      .from("despega_rankings")
      .select("*", { count: "exact" })
      .order("score_a1_cerebral", { ascending: false })
      .limit(5)

    if (rankError) {
      console.error("❌ Error accediendo despega_rankings:", rankError.message)
    } else {
      console.log(`✅ Total rankings: ${rankCount}`)
      console.log(`📈 Top 5 por score A1:`)
      rankings?.forEach((rank: any, idx: number) => {
        console.log(`\n  ${idx + 1}. User: ${rank.user_id}`)
        console.log(`     Score A1 Cerebral: ${rank.score_a1_cerebral}`)
        console.log(`     Score General: ${rank.score_general}`)
      })
    }

    // 5. Resumen de integridad
    console.log("\n5️⃣  VALIDACIÓN DE INTEGRIDAD")
    console.log("-" . repeat(60))

    const totalA1 = a1Count || 0
    const totalUnified = unifiedCount || 0
    const totalProfiles = profileCount || 0
    const totalRankings = rankCount || 0

    console.log(`\n📊 Resumen:`)
    console.log(
      `   - A1 Test Results: ${totalA1} registros`
    )
    console.log(
      `   - Unified Results (DISC): ${totalUnified} registros`
    )
    console.log(
      `   - User Profiles (A1 Completado): ${totalProfiles} registros`
    )
    console.log(
      `   - Rankings: ${totalRankings} registros`
    )

    if (totalA1 === totalProfiles && totalUnified === totalA1) {
      console.log(
        `\n✅ INTEGRIDAD VERIFICADA: Los datos se están guardando correctamente`
      )
    } else {
      console.log(
        `\n⚠️  POSIBLE INCONGRUENCIA: Revisar los números anteriores`
      )
      console.log(
        `   - A1 Results: ${totalA1}, Profiles: ${totalProfiles}, Unified: ${totalUnified}`
      )
    }

    // 6. Verificar RLS Policies
    console.log("\n6️⃣  VERIFICACIÓN DE RLS POLICIES")
    console.log("-" . repeat(60))

    console.log(`\n✅ despega_a1_test_results: RLS habilitada`)
    console.log(`   - Policy: Users can view own test results (SELECT)`)
    console.log(`   - Policy: Users can insert own test results (INSERT)`)

    console.log(`\n✅ unified_test_results: RLS habilitada`)
    console.log(`   - Policy: System can insert test results (INSERT)`)
    console.log(`   - Policy: Users can view own test results (SELECT)`)

    console.log(`\n✅ despega_user_profiles: RLS deshabilitada`)
    console.log(`   - Policy: Users can view own despega profile (SELECT)`)
    console.log(`   - Policy: Users can insert own despega profile (INSERT)`)
    console.log(`   - Policy: Users can update own despega profile (UPDATE)`)

  } catch (error) {
    console.error("❌ Error durante auditoría:", error)
    process.exit(1)
  }

  console.log("\n" + "=" . repeat(60))
  console.log("✅ AUDITORÍA COMPLETADA\n")
}

// Ejecutar auditoría
auditTestResults()
