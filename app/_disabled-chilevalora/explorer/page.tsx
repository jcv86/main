import { Metadata } from 'next'
import { ChileValoraExplorer } from '@/components/chilevalora-explorer'
import { createClient } from '@/lib/supabase/client'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Explorador ChileValora | Despega Tu Carrera',
  description: 'Descubre perfiles de carrera alineados con tus competencias usando el marco ChileValora',
}

export default async function ChileValoraPage() {
  const supabase = createClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Fetch user's test results
  let userTestResults: Record<string, number> = {}
  let userCompetencies: string[] = []

  try {
    // Get latest test results
    const { data: testData } = await supabase
      .from('unified_test_results')
      .select('test_results')
      .eq('user_email', user.email)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (testData?.test_results) {
      userTestResults = testData.test_results as Record<string, number>
    }

    // Extract competencies from test results
    userCompetencies = Object.keys(userTestResults).map(key => {
      const score = userTestResults[key]
      if (score > 80) return `${key} (Experto)`
      if (score > 60) return `${key} (Intermedio)`
      return `${key} (Básico)`
    })
  } catch (error) {
    console.error('Error fetching user test results:', error)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <ChileValoraExplorer
          userTestResults={userTestResults}
          userCompetencies={userCompetencies}
          onProfileSelect={(profile) => {
            console.log('Profile selected:', profile.nombre)
          }}
        />
      </div>
    </div>
  )
}
