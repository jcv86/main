import { put } from '@vercel/blob'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

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
      access: 'public',
    })

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
