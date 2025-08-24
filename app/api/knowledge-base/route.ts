import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search")
    const category = searchParams.get("category")

    let query = supabase
      .from("knowledge_base_articles")
      .select(`
        *,
        category:knowledge_base_categories(*)
      `)
      .order("sort_order", { ascending: true })

    if (search) {
      query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`)
    }

    if (category) {
      query = query.eq("knowledge_base_categories.slug", category)
    }

    const { data: articles, error } = await query

    if (error) {
      console.error("Error fetching articles:", error)
      return NextResponse.json({ error: "Failed to fetch articles" }, { status: 500 })
    }

    // Get featured articles
    const featuredArticles = articles?.filter((article) => article.is_featured) || []

    // Get categories with article counts
    const { data: categories, error: categoriesError } = await supabase
      .from("knowledge_base_categories")
      .select(`
        *,
        articles:knowledge_base_articles(count)
      `)
      .order("sort_order", { ascending: true })

    if (categoriesError) {
      console.error("Error fetching categories:", categoriesError)
    }

    return NextResponse.json({
      articles: articles || [],
      featuredArticles,
      categories: categories || [],
    })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
