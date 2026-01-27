import { redirect } from 'next/navigation'
import { createClient } from '@/app/utils/supabase/server'
import A1TestsHub from '@/components/a1-tests-hub'

export const metadata = {
  title: 'Tests A1 - Despega',
  description: 'Descubre tu perfil completando los tests psicométricos de Despega',
}

export default async function A1TestsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth')
  }

  // Obtener tests completados
  const { data: testResults } = await supabase
    .from('a1_tests_results')
    .select('test_type')
    .eq('user_id', user.id)

  const completedTests = {
    cerebral: !!testResults?.find((r: any) => r.test_type === 'cerebral'),
    inteligencia_emocional: !!testResults?.find((r: any) => r.test_type === 'inteligencia_emocional'),
    mapa_personalidad: !!testResults?.find((r: any) => r.test_type === 'mapa_personalidad'),
    cinco_dimensiones: !!testResults?.find((r: any) => r.test_type === '5_dimensiones'),
    brujula_vocacional: !!testResults?.find((r: any) => r.test_type === 'brujula_vocacional'),
    competencias: !!testResults?.find((r: any) => r.test_type === 'competencias'),
  }

  // Verificar si es premium
  const { data: subscription } = await supabase
    .from('user_subscriptions')
    .select('status')
    .eq('user_id', user.id)
    .single()

  const isPremium = subscription?.status === 'active'

  return <A1TestsHub completedTests={completedTests} isPremium={isPremium} />
}
