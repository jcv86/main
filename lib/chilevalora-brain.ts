import { createClient } from '@supabase/supabase-js'
import { generateEmbedding } from '@/lib/embeddings'
import type { Database } from '@/types/database'

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

/**
 * Phase 3: ChileValora Brain Integration
 * Semantic search and RAG for job profile discovery
 */

interface ChileValoraSearchResult {
  profile_codigo: string
  nombre: string
  sector: string
  chunk_content: string
  competencias: string[]
  nivel_demanda: 'alto' | 'medio' | 'bajo'
  empleabilidad: number
  similarity_score: number
}

interface CareerMatchResult {
  profile: ChileValoraSearchResult
  matchPercentage: number
  gapAnalysis: {
    competencia: string
    estado: 'acquired' | 'in_progress' | 'missing'
  }[]
}

export class ChileValoraBrain {
  /**
   * Search ChileValora profiles by semantic query
   * Example: "Quiero trabajar en tecnología con liderazgo"
   */
  static async searchProfiles(
    query: string,
    options?: {
      sector?: string
      min_demand?: 'bajo' | 'medio' | 'alto'
      max_results?: number
      threshold?: number
    }
  ): Promise<ChileValoraSearchResult[]> {
    console.log('[ChileValoraBrain] Searching for:', query)

    try {
      // Generate embedding for query
      const embedding = await generateEmbedding(query)

      // Build RPC query for vector similarity search
      let query_builder = supabase.rpc('search_chilevalora_profiles', {
        query_embedding: embedding,
        similarity_threshold: options?.threshold || 0.6,
        max_results: options?.max_results || 10,
      })

      // Apply filters if provided
      if (options?.sector) {
        query_builder = query_builder.eq('sector', options.sector)
      }

      if (options?.min_demand) {
        query_builder = query_builder.gte('nivel_demanda_score', this.demandToScore(options.min_demand))
      }

      const { data, error } = await query_builder

      if (error) {
        console.error('[ChileValoraBrain] Search error:', error)
        throw error
      }

      // Transform to ChileValoraSearchResult
      return data?.map((result: any) => ({
        profile_codigo: result.profile_codigo,
        nombre: result.profile_nombre,
        sector: result.sector,
        chunk_content: result.chunk_content,
        competencias: result.competencias || [],
        nivel_demanda: result.nivel_demanda,
        empleabilidad: result.empleabilidad || 0,
        similarity_score: result.similarity,
      })) || []
    } catch (error) {
      console.error('[ChileValoraBrain] Search failed:', error)
      return []
    }
  }

  /**
   * Find career path: Match user test results to ChileValora profiles
   * Returns profiles aligned with their competencies
   */
  static async findCareerPath(
    userTestResults: Record<string, number>,
    userCompetencies: string[]
  ): Promise<CareerMatchResult[]> {
    console.log('[ChileValoraBrain] Finding career path for user...')

    // Convert test results to semantic query
    const queryParts = Object.entries(userTestResults)
      .filter(([_, score]) => score > 60)
      .map(([dimension, score]) => `${dimension} (${score}%)`)

    const semanticQuery = `Perfil profesional con fortalezas en: ${queryParts.join(', ')}`

    // Search profiles
    const profiles = await this.searchProfiles(semanticQuery, {
      max_results: 5,
      threshold: 0.5,
    })

    // Analyze gaps for each profile
    const results: CareerMatchResult[] = profiles.map(profile => {
      const gapAnalysis = profile.competencias.map(competencia => {
        const hasCompetency = userCompetencies.some(uc =>
          uc.toLowerCase().includes(competencia.toLowerCase())
        )

        return {
          competencia,
          estado: hasCompetency ? ('acquired' as const) : ('missing' as const),
        }
      })

      const acquiredCount = gapAnalysis.filter(g => g.estado === 'acquired').length
      const matchPercentage =
        gapAnalysis.length > 0
          ? Math.round((acquiredCount / gapAnalysis.length) * 100)
          : 0

      return {
        profile,
        matchPercentage,
        gapAnalysis,
      }
    })

    return results
  }

  /**
   * Get trending profiles by sector and demand
   */
  static async getTrendingProfiles(
    sector?: string,
    limit: number = 10
  ): Promise<ChileValoraSearchResult[]> {
    console.log('[ChileValoraBrain] Fetching trending profiles...')

    let query = supabase
      .from('chilevalora_profiles')
      .select(
        `
        codigo,
        nombre,
        sector,
        data->nivel_demanda as nivel_demanda,
        data->empleabilidad as empleabilidad
      `
      )
      .eq('estado', 'activo')
      .order('data->>empleabilidad', { ascending: false })
      .limit(limit)

    if (sector) {
      query = query.eq('sector', sector)
    }

    const { data, error } = await query

    if (error) {
      console.error('[ChileValoraBrain] Trending query error:', error)
      return []
    }

    return data?.map((profile: any) => ({
      profile_codigo: profile.codigo,
      nombre: profile.nombre,
      sector: profile.sector,
      chunk_content: '',
      competencias: [],
      nivel_demanda: profile.nivel_demanda || 'medio',
      empleabilidad: profile.empleabilidad || 0,
      similarity_score: 1,
    })) || []
  }

  /**
   * Get sectors available in ChileValora
   */
  static async getSectors(): Promise<string[]> {
    const { data, error } = await supabase
      .from('chilevalora_profiles')
      .select('sector', { distinct: true })
      .eq('estado', 'activo')

    if (error) {
      console.error('[ChileValoraBrain] Sectors query error:', error)
      return []
    }

    return data?.map(d => d.sector).filter(Boolean) || []
  }

  /**
   * Convert demand level to numeric score for filtering
   */
  private static demandToScore(demand: string): number {
    const scores: Record<string, number> = {
      bajo: 1,
      medio: 2,
      alto: 3,
    }
    return scores[demand] || 2
  }

  /**
   * Log interaction when user views a profile
   * (for market trend tracking)
   */
  static async logProfileInteraction(
    userId: string,
    profileCodigo: string,
    interactionType: 'view' | 'favorite' | 'compare'
  ) {
    try {
      const { data: profileData } = await supabase
        .from('chilevalora_profiles')
        .select('id')
        .eq('codigo', profileCodigo)
        .single()

      if (!profileData) return

      await supabase.from('user_chilevalora_interactions').insert({
        user_id: userId,
        profile_id: profileData.id,
        interaction_type: interactionType,
      })
    } catch (error) {
      console.error('[ChileValoraBrain] Failed to log interaction:', error)
    }
  }
}

export type { ChileValoraSearchResult, CareerMatchResult }
