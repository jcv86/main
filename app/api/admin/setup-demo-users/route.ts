import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { hash } from 'bcryptjs'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

const DEMO_USERS = [
  {
    email: 'travis@nuanu.com',
    password: 'travis123',
    fullName: 'Travis',
    role: 'Developer',
  },
  {
    email: 'demo@despegaturcarrera.com',
    password: 'demo123',
    fullName: 'Ana',
    role: 'Marketing',
  },
  {
    email: 'test@dtc.com',
    password: 'test123',
    fullName: 'Carlos',
    role: 'PM',
  },
  {
    email: 'admin@dtc.com',
    password: 'admin123',
    fullName: 'María',
    role: 'Admin',
  },
]

export async function POST(request: Request) {
  try {
    const results = []

    for (const user of DEMO_USERS) {
      try {
        // Try to create user - if it exists, the error will be caught
        const { data, error } = await supabase.auth.admin.createUser({
          email: user.email,
          password: user.password,
          email_confirm: true,
          user_metadata: {
            name: user.fullName,
            role: user.role,
          },
        })

        if (error) {
          // Check if error is because user already exists
          if (error.message.includes('already exists')) {
            console.log(`User ${user.email} already exists`)
            results.push({
              email: user.email,
              success: false,
              message: 'User already exists',
            })
            continue
          }
          
          console.error(`Error creating user ${user.email}:`, error)
          results.push({
            email: user.email,
            success: false,
            message: error.message,
          })
          continue
        }

        // Create user profile
        if (data?.user) {
          const { error: profileError } = await supabase
            .from('users')
            .upsert(
              {
                id: data.user.id,
                email: user.email,
                full_name: user.fullName,
                updated_at: new Date(),
              },
              { onConflict: 'id' }
            )

          if (profileError) {
            console.error(`Error creating profile for ${user.email}:`, profileError)
            results.push({
              email: user.email,
              success: false,
              message: `User created but profile failed: ${profileError.message}`,
            })
            continue
          }

          results.push({
            email: user.email,
            success: true,
            userId: data.user.id,
            message: 'Demo user created successfully',
          })
        }
      } catch (e) {
        console.error(`Exception creating user ${user.email}:`, e)
        results.push({
          email: user.email,
          success: false,
          message: `Exception: ${String(e)}`,
        })
      }
    }

    return NextResponse.json(
      {
        message: 'Demo users setup completed',
        results,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Failed to create demo users', details: String(error) },
      { status: 500 }
    )
  }
}
