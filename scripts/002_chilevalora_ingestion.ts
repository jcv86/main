import { createClient } from '@supabase/supabase-js'
import * as cheerio from 'cheerio'
import fetch from 'node-fetch'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

interface ChileValoraProfile {
  codigo: string
  nombre: string
  estado: string
  sector: string
  descripcion: string
  competencias: string[]
  nivel_demanda: 'alto' | 'medio' | 'bajo'
  salario_promedio?: number
  empleabilidad?: number
}

interface ChileValoraUCL {
  codigo: string
  nombre: string
  descripcion: string
  nivel: number
}

/**
 * Phase 2: Ingestion Pipeline
 * Scrapes ChileValora profiles and ingests into Supabase
 * Run: npx ts-node scripts/002_chilevalora_ingestion.ts
 */

const CHILEVALORA_BASE_URL = 'https://www.chilevalora.cl'
const BATCH_SIZE = 100

class ChileValoraIngestion {
  private ingestionId: string
  private profilesIngested = 0
  private uclIngested = 0

  constructor() {
    this.ingestionId = `ingestion_${Date.now()}`
  }

  /**
   * Parse ChileValora profile HTML page
   */
  async parseProfilePage(html: string, codigo: string): Promise<ChileValoraProfile> {
    const $ = cheerio.load(html)

    const nombre = $('h1[data-qa="profile-title"]').text().trim()
    const estado = $('[data-qa="profile-status"]').attr('data-status') || 'activo'
    const sector = $('[data-qa="profile-sector"]').text().trim()
    const descripcion = $('[data-qa="profile-description"]').text().trim()

    // Extract competencies
    const competencias: string[] = []
    $('[data-qa="profile-competency"]').each((_, el) => {
      competencias.push($(el).text().trim())
    })

    // Extract demand level from market indicators
    const demandaText = $('[data-qa="demand-level"]').text().toLowerCase()
    let nivel_demanda: 'alto' | 'medio' | 'bajo' = 'medio'
    if (demandaText.includes('alto')) nivel_demanda = 'alto'
    else if (demandaText.includes('bajo')) nivel_demanda = 'bajo'

    // Extract salary data
    const salarioText = $('[data-qa="avg-salary"]').text()
    const salario_promedio = this.extractNumber(salarioText)

    // Extract employability score (0-100)
    const empleabilidadText = $('[data-qa="employability"]').text()
    const empleabilidad = this.extractNumber(empleabilidadText)

    return {
      codigo,
      nombre,
      estado,
      sector,
      descripcion,
      competencias,
      nivel_demanda,
      salario_promedio,
      empleabilidad,
    }
  }

  /**
   * Extract numeric value from text
   */
  private extractNumber(text: string): number | undefined {
    const match = text.match(/(\d+(?:\.\d{1,2})?)/);
    return match ? parseFloat(match[1]) : undefined
  }

  /**
   * Ingest profiles into Supabase
   */
  async ingestProfiles(profiles: ChileValoraProfile[]) {
    console.log(`[${this.ingestionId}] Ingesting ${profiles.length} profiles...`)

    // Batch upsert profiles
    const { error: profileError, count } = await supabase
      .from('chilevalora_profiles')
      .upsert(
        profiles.map(p => ({
          codigo: p.codigo,
          nombre: p.nombre,
          estado: p.estado,
          sector: p.sector,
          data: {
            descripcion: p.descripcion,
            competencias: p.competencias,
            nivel_demanda: p.nivel_demanda,
            salario_promedio: p.salario_promedio,
            empleabilidad: p.empleabilidad,
          },
        })),
        { onConflict: 'codigo' }
      )

    if (profileError) {
      console.error(`[${this.ingestionId}] Profile ingestion error:`, profileError)
      throw profileError
    }

    this.profilesIngested += count || 0
    console.log(`[${this.ingestionId}] ✓ Ingested ${count || 0} profiles`)
  }

  /**
   * Chunk profile data for embedding/RAG
   */
  async chunkProfiles(profiles: ChileValoraProfile[]) {
    console.log(`[${this.ingestionId}] Creating chunks for RAG...`)

    const chunks = []

    for (const profile of profiles) {
      // Create multiple chunks per profile for better semantic search
      const chunks_data = [
        {
          profile_codigo: profile.codigo,
          chunk_type: 'overview',
          content: `Perfil: ${profile.nombre}. Sector: ${profile.sector}. Estado: ${profile.estado}. ${profile.descripcion}`,
          source_url: `${CHILEVALORA_BASE_URL}/perfiles/${profile.codigo}`,
          order: 0,
        },
        {
          profile_codigo: profile.codigo,
          chunk_type: 'competencies',
          content: `Competencias requeridas para ${profile.nombre}: ${profile.competencias.join(', ')}`,
          source_url: `${CHILEVALORA_BASE_URL}/perfiles/${profile.codigo}`,
          order: 1,
        },
        {
          profile_codigo: profile.codigo,
          chunk_type: 'market',
          content: `Demanda de ${profile.nombre}: ${profile.nivel_demanda.toUpperCase()}. Empleabilidad: ${profile.empleabilidad || 'N/A'}%. Salario promedio: $${profile.salario_promedio?.toLocaleString() || 'No disponible'}`,
          source_url: `${CHILEVALORA_BASE_URL}/perfiles/${profile.codigo}`,
          order: 2,
        },
      ]

      chunks.push(...chunks_data)
    }

    // Upsert chunks
    const { error: chunkError, count } = await supabase
      .from('chilevalora_chunks')
      .upsert(chunks, { onConflict: 'id' })

    if (chunkError) {
      console.error(`[${this.ingestionId}] Chunk ingestion error:`, chunkError)
      throw chunkError
    }

    console.log(`[${this.ingestionId}] ✓ Created ${count || 0} chunks for RAG`)
  }

  /**
   * Link profiles to UCL competencies
   */
  async linkProfilesWithUCL(profiles: ChileValoraProfile[]) {
    console.log(`[${this.ingestionId}] Linking profiles with UCL framework...`)

    // Get all UCL records
    const { data: ucls } = await supabase.from('chilevalora_ucl').select('id, codigo')

    if (!ucls || ucls.length === 0) {
      console.warn(`[${this.ingestionId}] No UCL records found. Skipping linkage.`)
      return
    }

    const links = []

    for (const profile of profiles) {
      // Get profile ID
      const { data: profileData } = await supabase
        .from('chilevalora_profiles')
        .select('id')
        .eq('codigo', profile.codigo)
        .single()

      if (!profileData) continue

      // For each competency in profile, find matching UCL
      for (const competencia of profile.competencias) {
        const matchingUCL = ucls.find(ucl =>
          competencia.toLowerCase().includes(ucl.codigo.toLowerCase())
        )

        if (matchingUCL) {
          links.push({
            profile_id: profileData.id,
            ucl_id: matchingUCL.id,
          })
        }
      }
    }

    if (links.length > 0) {
      const { error: linkError, count } = await supabase
        .from('chilevalora_profile_ucl')
        .upsert(links, { onConflict: 'profile_id,ucl_id' })

      if (linkError) {
        console.error(`[${this.ingestionId}] UCL linkage error:`, linkError)
      } else {
        console.log(`[${this.ingestionId}] ✓ Linked ${count || 0} profile-UCL mappings`)
      }
    }
  }

  /**
   * Run full ingestion pipeline
   */
  async run() {
    try {
      console.log(`\n[${this.ingestionId}] Starting ChileValora ingestion pipeline...`)

      // TODO: Replace with actual data source
      // For now, using sample data structure
      const sampleProfiles: ChileValoraProfile[] = [
        {
          codigo: 'CV_SUP_AGR',
          nombre: 'Supervisor Agrícola',
          estado: 'activo',
          sector: 'Agricultura',
          descripcion:
            'Profesional responsable de supervisar operaciones agrícolas, gestionar equipos y optimizar procesos de producción.',
          competencias: [
            'Liderazgo',
            'Gestión de personal',
            'Conocimiento agrícola',
            'Análisis de datos',
          ],
          nivel_demanda: 'alto',
          salario_promedio: 2500000,
          empleabilidad: 85,
        },
        {
          codigo: 'CV_DEV_FULL',
          nombre: 'Desarrollador Full Stack',
          estado: 'activo',
          sector: 'Tecnología',
          descripcion:
            'Ingeniero de software con expertise en frontend y backend, capaz de desarrollar aplicaciones completas.',
          competencias: [
            'Programación',
            'JavaScript/TypeScript',
            'Bases de datos',
            'Cloud computing',
          ],
          nivel_demanda: 'alto',
          salario_promedio: 3500000,
          empleabilidad: 92,
        },
      ]

      // Process in batches
      for (let i = 0; i < sampleProfiles.length; i += BATCH_SIZE) {
        const batch = sampleProfiles.slice(i, i + BATCH_SIZE)
        await this.ingestProfiles(batch)
        await this.chunkProfiles(batch)
        await this.linkProfilesWithUCL(batch)
      }

      console.log(`[${this.ingestionId}] ✓ Ingestion complete!`)
      console.log(
        `  - Profiles ingested: ${this.profilesIngested}\n  - Ingestion ID: ${this.ingestionId}`
      )
    } catch (error) {
      console.error(`[${this.ingestionId}] Ingestion failed:`, error)
      process.exit(1)
    }
  }
}

// Run ingestion
const ingestion = new ChileValoraIngestion()
ingestion.run()
