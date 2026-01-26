import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/app/utils/supabase/server'
import PerfilDescubiertoViewer from '@/components/perfil-descubierto-viewer'

export const metadata: Metadata = {
  title: 'Tu Perfil Descubierto | Despega',
  description: 'Informe detallado de tu perfil del Test Despega Cerebral',
}

export default async function PerfilPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth')
  }

  // Obtener el informe más reciente
  const { data: informe, error } = await supabase
    .from('despega_perfil_informe')
    .select('*')
    .eq('user_id', user.id)
    .order('generado_at', { ascending: false })
    .limit(1)
    .single()

  if (error || !informe) {
    redirect('/test-cerebral')
  }

  // Verificar si es usuario PREMIUM
  const { data: subscription } = await supabase
    .from('user_subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .single()

  const isPremium = subscription?.status === 'active'

  return (
    <PerfilDescubiertoViewer
      perfil={informe}
      isPremium={isPremium}
    />
  )
}
