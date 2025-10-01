import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export interface WebResource {
  id: number
  url: string
  title: string
  description?: string
  content: string
  category: string
  source_type: "article" | "report" | "data" | "news" | "government" | "academic"
  country: string
  tags: string[]
  author?: string
  published_date?: string
  access_count: number
  last_accessed_at?: string
  metadata?: Record<string, any>
  created_at: string
  updated_at: string
}

export interface UnifiedBrainResult {
  source_type: "book" | "web_resource"
  id: number
  title: string
  category: string
  author?: string
  tags: string[]
  identifier: string
  content_preview: string
  relevance_score: number
}

/**
 * Agregar un nuevo recurso web al cerebro
 */
export async function addWebResource(
  resource: Omit<WebResource, "id" | "access_count" | "created_at" | "updated_at">,
): Promise<WebResource | null> {
  try {
    const { data, error } = await supabase.from("web_resources").insert([resource]).select().single()

    if (error) {
      console.error("Error adding web resource:", error)
      throw error
    }

    return data
  } catch (error) {
    console.error("Failed to add web resource:", error)
    throw error
  }
}

/**
 * Agregar múltiples recursos web en batch
 */
export async function addWebResourcesBatch(
  resources: Omit<WebResource, "id" | "access_count" | "created_at" | "updated_at">[],
): Promise<WebResource[]> {
  try {
    const { data, error } = await supabase.from("web_resources").insert(resources).select()

    if (error) {
      console.error("Error adding web resources batch:", error)
      throw error
    }

    return data || []
  } catch (error) {
    console.error("Failed to add web resources batch:", error)
    throw error
  }
}

/**
 * Obtener recurso web por ID
 */
export async function getWebResourceById(id: number): Promise<WebResource | null> {
  try {
    const { data, error } = await supabase.from("web_resources").select("*").eq("id", id).single()

    if (error) {
      console.error("Error fetching web resource:", error)
      throw error
    }

    return data
  } catch (error) {
    console.error("Failed to fetch web resource:", error)
    throw error
  }
}

/**
 * Obtener recursos web por categoría
 */
export async function getWebResourcesByCategory(category: string, limit = 20): Promise<WebResource[]> {
  try {
    const { data, error } = await supabase.rpc("get_web_resources_by_category", {
      category_name: category,
      limit_count: limit,
    })

    if (error) {
      console.error("Error fetching web resources by category:", error)
      throw error
    }

    return data || []
  } catch (error) {
    console.error("Failed to fetch web resources by category:", error)
    throw error
  }
}

/**
 * Buscar en todo el cerebro (libros + recursos web)
 */
export async function searchUnifiedBrain(
  query: string,
  categoryFilter?: string,
  sourceTypeFilter?: "book" | "web_resource",
  limit = 10,
): Promise<UnifiedBrainResult[]> {
  try {
    const { data, error } = await supabase.rpc("search_brain_unified", {
      search_query: query,
      category_filter: categoryFilter || null,
      source_type_filter: sourceTypeFilter || null,
      limit_results: limit,
    })

    if (error) {
      console.error("Error searching unified brain:", error)
      throw error
    }

    return data || []
  } catch (error) {
    console.error("Failed to search unified brain:", error)
    throw error
  }
}

/**
 * Incrementar contador de acceso a recurso web
 */
export async function incrementWebResourceAccess(resourceId: number): Promise<number> {
  try {
    const { data, error } = await supabase.rpc("increment_web_resource_access", {
      resource_id: resourceId,
    })

    if (error) {
      console.error("Error incrementing web resource access:", error)
      throw error
    }

    return data
  } catch (error) {
    console.error("Failed to increment web resource access:", error)
    throw error
  }
}

/**
 * Obtener recursos web más populares
 */
export async function getPopularWebResources(limit = 10): Promise<WebResource[]> {
  try {
    const { data, error } = await supabase.rpc("get_popular_web_resources", {
      limit_count: limit,
    })

    if (error) {
      console.error("Error fetching popular web resources:", error)
      throw error
    }

    return data || []
  } catch (error) {
    console.error("Failed to fetch popular web resources:", error)
    throw error
  }
}

/**
 * Obtener todos los recursos web
 */
export async function getAllWebResources(): Promise<WebResource[]> {
  try {
    const { data, error } = await supabase.from("web_resources").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching all web resources:", error)
      throw error
    }

    return data || []
  } catch (error) {
    console.error("Failed to fetch all web resources:", error)
    throw error
  }
}

/**
 * Actualizar recurso web
 */
export async function updateWebResource(id: number, updates: Partial<WebResource>): Promise<WebResource | null> {
  try {
    const { data, error } = await supabase.from("web_resources").update(updates).eq("id", id).select().single()

    if (error) {
      console.error("Error updating web resource:", error)
      throw error
    }

    return data
  } catch (error) {
    console.error("Failed to update web resource:", error)
    throw error
  }
}

/**
 * Eliminar recurso web
 */
export async function deleteWebResource(id: number): Promise<boolean> {
  try {
    const { error } = await supabase.from("web_resources").delete().eq("id", id)

    if (error) {
      console.error("Error deleting web resource:", error)
      throw error
    }

    return true
  } catch (error) {
    console.error("Failed to delete web resource:", error)
    throw error
  }
}

/**
 * Obtener categorías únicas de recursos web
 */
export async function getWebResourceCategories(): Promise<string[]> {
  try {
    const { data, error } = await supabase.from("web_resources").select("category").order("category")

    if (error) {
      console.error("Error fetching web resource categories:", error)
      throw error
    }

    const uniqueCategories = [...new Set(data?.map((item) => item.category) || [])]
    return uniqueCategories
  } catch (error) {
    console.error("Failed to fetch web resource categories:", error)
    throw error
  }
}
