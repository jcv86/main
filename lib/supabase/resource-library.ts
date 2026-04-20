import { createClient } from '@/lib/supabase/client'

export interface Resource {
  id: string
  title: string
  description: string
  url: string
  category: string
  subcategory?: string
  resource_type: string
  difficulty_level?: string
  estimated_time?: string
  language?: string
  tags: string[]
  verified: boolean
  active: boolean
}

// Fetch all resources
export async function fetchAllResources(): Promise<Resource[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('a2_resource_library')
    .select('*')
    .eq('active', true)
    .order('category')

  if (error) {
    console.error('[v0] Error fetching resources:', error)
    return []
  }

  return data || []
}

// Fetch resources by category
export async function fetchResourcesByCategory(category: string): Promise<Resource[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('a2_resource_library')
    .select('*')
    .eq('category', category)
    .eq('active', true)
    .order('title')

  if (error) {
    console.error('[v0] Error fetching resources by category:', error)
    return []
  }

  return data || []
}

// Fetch resources by tags
export async function fetchResourcesByTag(tag: string): Promise<Resource[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('a2_resource_library')
    .select('*')
    .contains('tags', [tag])
    .eq('active', true)
    .order('title')

  if (error) {
    console.error('[v0] Error fetching resources by tag:', error)
    return []
  }

  return data || []
}

// Get unique categories
export async function fetchCategories(): Promise<string[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('a2_resource_library')
    .select('category')
    .eq('active', true)
    .distinct()

  if (error) {
    console.error('[v0] Error fetching categories:', error)
    return []
  }

  const categories = data?.map(item => item.category) || []
  return [...new Set(categories)].sort()
}

// Get resource count by category
export async function fetchResourceCounts(): Promise<Record<string, number>> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('a2_resource_library')
    .select('category')
    .eq('active', true)

  if (error) {
    console.error('[v0] Error fetching resource counts:', error)
    return {}
  }

  const counts: Record<string, number> = {}
  data?.forEach(item => {
    counts[item.category] = (counts[item.category] || 0) + 1
  })

  return counts
}
