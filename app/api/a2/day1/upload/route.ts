import { put } from '@vercel/blob'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    const demoUserCookie = cookieStore.get('demo_user')
    
    if (!demoUserCookie) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const demoUser = JSON.parse(demoUserCookie.value)
    const userId = demoUser.id

    // Get form data
    const formData = await request.formData()
    const file = formData.get('file') as File
    const fileName = formData.get('fileName') as string

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Upload to Vercel Blob
    const filename = `day1/${userId}/${Date.now()}-${fileName}`
    const blob = await put(filename, file, {
      access: 'private',
    })

    // Store blob reference in database
    const supabase = createAdminClient()
    const { data: submission, error: getError } = await supabase
      .from('a2_day1_submissions')
      .select('id')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (getError && getError.code !== 'PGRST116') {
      console.error('[v0] Error fetching submission:', getError)
    }

    if (submission) {
      const { error: updateError } = await supabase
        .from('a2_day1_submissions')
        .update({
          document_blob_id: blob.pathname,
          document_url: blob.url,
          document_name: fileName,
          updated_at: new Date().toISOString(),
        })
        .eq('id', submission.id)

      if (updateError) {
        console.error('[v0] Error updating submission:', updateError)
      }
    }

    return NextResponse.json({
      success: true,
      blob: {
        url: blob.url,
        pathname: blob.pathname,
        fileName: fileName,
      },
    })
  } catch (error) {
    console.error('[v0] Upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    )
  }
}
