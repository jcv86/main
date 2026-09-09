import { NextResponse } from 'next/server'
import { z } from 'zod'

import { getSuperadminUser } from '@/lib/auth/require-superadmin'
import { createAdminClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

const noStore = { 'Cache-Control': 'private, no-store, max-age=0' }
const bookInput = z.object({
  title: z.string().trim().min(1).max(300),
  author: z.string().trim().min(1).max(200),
  category: z.string().trim().min(1).max(100),
  content: z.string().trim().min(1),
  tags: z.array(z.string().trim().min(1).max(80)).max(30),
  slug: z.string().trim().min(1).max(300),
})

async function authorize() {
  return Boolean(await getSuperadminUser())
}

export async function GET() {
  if (!(await authorize())) return NextResponse.json({ error: 'Forbidden' }, { status: 403, headers: noStore })
  const { data, error } = await createAdminClient()
    .from('knowledge_base')
    .select('id,title,category,content,author,tags,slug,read_count,created_at,updated_at')
    .order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: 'Unable to load knowledge base' }, { status: 500, headers: noStore })
  return NextResponse.json({ books: data ?? [] }, { headers: noStore })
}

export async function POST(request: Request) {
  if (!(await authorize())) return NextResponse.json({ error: 'Forbidden' }, { status: 403, headers: noStore })
  const parsed = bookInput.safeParse(await request.json().catch(() => null))
  if (!parsed.success) return NextResponse.json({ error: 'Invalid book payload' }, { status: 400, headers: noStore })
  const { data, error } = await createAdminClient().from('knowledge_base')
    .insert({ ...parsed.data, read_count: 0 }).select().single()
  if (error) return NextResponse.json({ error: 'Unable to add book' }, { status: 500, headers: noStore })
  return NextResponse.json({ book: data }, { status: 201, headers: noStore })
}

export async function PATCH(request: Request) {
  if (!(await authorize())) return NextResponse.json({ error: 'Forbidden' }, { status: 403, headers: noStore })
  const body = await request.json().catch(() => null)
  const parsed = z.object({ id: z.number().int().positive(), book: bookInput }).safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid book payload' }, { status: 400, headers: noStore })
  const { data, error } = await createAdminClient().from('knowledge_base')
    .update({ ...parsed.data.book, updated_at: new Date().toISOString() })
    .eq('id', parsed.data.id).select().single()
  if (error) return NextResponse.json({ error: 'Unable to update book' }, { status: 500, headers: noStore })
  return NextResponse.json({ book: data }, { headers: noStore })
}

export async function DELETE(request: Request) {
  if (!(await authorize())) return NextResponse.json({ error: 'Forbidden' }, { status: 403, headers: noStore })
  const id = Number(new URL(request.url).searchParams.get('id'))
  if (!Number.isInteger(id) || id <= 0) return NextResponse.json({ error: 'Invalid book id' }, { status: 400, headers: noStore })
  const { error } = await createAdminClient().from('knowledge_base').delete().eq('id', id)
  if (error) return NextResponse.json({ error: 'Unable to delete book' }, { status: 500, headers: noStore })
  return new NextResponse(null, { status: 204, headers: noStore })
}
