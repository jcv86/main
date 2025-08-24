import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  try {
    const { data: article, error } = await supabase
      .from("knowledge_base_articles")
      .select(`
        *,
        category:knowledge_base_categories(*)
      `)
      .eq("slug", params.slug)
      .single()

    if (error) {
      console.error("Error fetching article:", error)
      return NextResponse.json({ error: "Article not found" }, { status: 404 })
    }

    // Get related articles from the same category
    const { data: relatedArticles } = await supabase
      .from("knowledge_base_articles")
      .select("id, title, slug, excerpt")
      .eq("category_id", article.category_id)
      .neq("id", article.id)
      .limit(3)

    return NextResponse.json({
      article,
      relatedArticles: relatedArticles || [],
    })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
